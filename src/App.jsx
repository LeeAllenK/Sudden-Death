import { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { HomeBtn } from './components/Home-Btn';
import { InstructionsBtn } from './components/InstructionsBtn';
// import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState('');
  const [play, setPlay] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [leaderboards, setLeaderboards] = useState(false);
  const [leaders, setLeaders]= useState([]);

  useEffect(() => {
    const getDeck = async () => {
      const url = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setDeckId(data.deck_id);
      } catch(err) {
        console.error(err);
      }
    };
    if(play) {
      getDeck();
    }
  }, [play]);
  useEffect(() => {
    const start = async () => {
      if(!deckId) return;
      const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCards(data.cards);
      } catch(err) {
        console.error(err);
      }
    };
    if(deckId) {
      start();
    }
  }, [deckId]);

  useEffect(() => {
      const fetchTimes = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`);
          if(!res.ok) {
            throw new Error('no response');
          }
          const data = await res.json();
          console.log(data);
          setLeaders(data)
        } catch(err) {
          console.error('Fetch error:', err);
        }
    }
      if(leaderboards){
        fetchTimes();
      }
  }, [leaderboards]);
  console.log('VITE',import.meta.env.VITE_API_URL);

  const handleClick = () => {
    setInstructions(true);
  };

  useEffect(() => {
    document.body.className = play ? ' bg-[#383636]' : 'bg-black';
  }, [play]);

  const sortedLeaders = leaders.sort((a, b) => {
    const timeA = a.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    const timeB = b.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    return timeA - timeB;
  });
  return (
  <>
    <div className="flex flex-col items-center justify-center h-screen lg:w-screen md:w-screen font-bold p-10">
      {leaderboards ? (
        <div className='flex flex-col items-center lg:w-screen lg:h-screen md:w-screen md:h-screen'>
          <button
              className='border lg:text-4xl lg:border-4 lg:screen mt-2 lg:rounded-full lg:h-15 lg:w-100 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse'
            onClick={() => setLeaderboards(false)}
          >
            MENU
          </button>
          <p className=' flex  text-5xl text-red-700 '>Leaderboard</p>
            <ul className='leaderboard'>
              {sortedLeaders.map((lead,i) => (
                <li className='stats' key={lead._id}>
                 {lead.text.toUpperCase()}{' '}{lead.time}
                </li>
              ))}
            </ul>
        </div>
      ) : !play && !instructions ? (
        <div className='flex flex-col lg:items-center md:items-center lg:justify-evenly md:justify-start sm:justify-start items-center justify-start h-screen  p-1'>
              <h1 className='lg:text-8xl md:text-7xl sm:text-7xl text-6xl font-bold text-red-700 cursor:pointer animate-pulse mb-4 md:mt-1 md:p-1'>SUDDEN DEATH!</h1>
          <button
                className=' flex justify-center items-center  lg:text-7xl md:text-5xl sm:text-5xl text-4xl border-4 lg:rounded-full lg:h-30 md:h-20 sm:h-20 h-15 lg:w-200 md:w-screen sm:w-screen w-screen active:translate-y-2 md:mb-3 sm:mb-3 mb-4 cursor-pointer border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#717070] to-[#f7acac] shadow-[0_4px_3px_#ff0101] bg-black text-red-700 hover:animate-pulse leading-tight'
            onClick={() => setPlay(p => !p)}
          >
            Play
          </button>
          <button
                className='flex justify-center items-center lg:text-7xl md:text-6xl sm:text-5xl text-4xl border-4 lg:rounded-full lg:h-30 md:h-20 sm:h-20 h-20 lg:w-200 md:w-screen sm:w-screen w-screen active:translate-y-2  sm:mb-3 mb-4 cursor-pointer border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#717070] to-[#f7acac] shadow-[0_4px_3px_#ff0101] bg-black text-red-700 hover:animate-pulse leading-tight'
            onClick={() => setLeaderboards(lb => !lb)}
          >
            Leaderboard
          </button>
          <InstructionsBtn onClick={handleClick} value='Instructions' />
        </div>
      ) : (
        <>
          {!instructions && (
          <>
            <HomeBtn onClick={ ()=> setPlay(p=>!p)} />
              <Game cards={cards} />
          </>
          )}
        </>
      )}
    </div>
  </>
  );
}
export default App;
