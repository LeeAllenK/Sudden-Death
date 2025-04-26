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
    <div className="flex flex-col items-center justify-center h-screen lg:w-screen font-bold p-10">
      {leaderboards ? (
        <div className='flex flex-col items-center lg:w-screen lg:h-screen'>
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
        <div className='flex flex-col items-center justify-evenly h-screen p-1'>
              <h1 className='lg:text-8xl lg:font-bold text-red-700 cursor:pointer animate-pulse'>SUDDEN DEATH!</h1>
          <button
                className='flex justify-center items-center border lg:text-7xl lg:border-4 lg:screen lg:rounded-full lg:h-30 lg:w-200 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse'
            onClick={() => setPlay(p => !p)}
          >
            Play
          </button>
          <button
                className='flex justify-center items-center border lg:text-7xl lg:border-4 lg:screen lg:rounded-full lg:h-30 lg:w-200 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse mt-2'
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
