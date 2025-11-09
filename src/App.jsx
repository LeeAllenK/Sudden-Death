import { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { Menu } from './components/Menu';
import {Leaderboard} from './components/Leaderboards'
import { Instructions } from './components/Instructions';

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
          const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_LOCALHOST ;
          const res = await fetch(`${url}/api/stats`);
          if(!res.ok) {
            throw new Error('no response');
          }
          const text = await res.json();
          setLeaders(text);
          console.log(text);
          console.log('Using API base URL:', url);
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
    document.body.className = !play ? ' bg-[#383636]' : 'bg-black';
  }, [play]);

  const sortedLeaders = leaders.sort((a, b) => {
    const timeA = a.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    const timeB = b.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    return timeA - timeB;
  });
  return (
  <>
    <section className="items-center justify-center h-screen w-screen font-bold ">
      {instructions ? (
          <Instructions onClick={() => setInstructions(si=>!si)} setInstructions={setInstructions}/>
      ) : play ? (
          <Game cards={cards} setPlay={setPlay}  />        
      ) : leaderboards ? (    
          <Leaderboard  setLeaderboards={setLeaderboards} sortedLeaders={sortedLeaders}/>    
      ) :( 
          <Menu setInstructions={setInstructions} setPlay={setPlay} setLeaderboards={setLeaderboards} />
      )}
    </section>
  </>
  );
}
export default App;
