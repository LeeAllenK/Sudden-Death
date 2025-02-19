import { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { InstructionsBtn } from './components/InstructionsBtn';
import './App.css';

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

  const handleClick = () => {
    setInstructions(true);
  };

  useEffect(() => {
    document.body.className = play ? 'play-mode' : 'default-mode';
  }, [play]);

  const sortedLeaders = leaders.sort((a, b) => {
    const timeA = a.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    const timeB = b.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    return timeA - timeB;
  });
  return (
  <>
    <div className="appScreen">
      {leaderboards ? (
        <div className='leaderboardScreen'>
          <p className='leaderboard-title'>Leaderboard</p>
            <ul className='leaderboard'>
              {sortedLeaders.map((lead,i) => (
                <li className='stats' key={lead._id}>
                 {lead.text.toUpperCase()}{' '}{lead.time}
                </li>
              ))}
            </ul>
          <button
            className='backBtn'
            onClick={() => setLeaderboards(false)}
          >
            MENU
          </button>
        </div>
      ) : !play && !instructions ? (
        <div className='playBorder'>
          <h1 className='suddenDeath'>SUDDEN DEATH!</h1>
          <button
            className='playBtn'
            onClick={() => setPlay(p => !p)}
          >
            Play
          </button>
          <button
            className='leaderboardBtn'
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
              <button
                className='homeBtn'
                onClick={() => setPlay(p => !p)}
              >
                Home
              </button>
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
