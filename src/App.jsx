import { useState, useEffect,useReducer } from 'react';
import { Game } from './components/Game';
import { Menu } from './components/Menu';
import {Leaderboard} from './components/Leaderboards'
import { Instructions } from './components/Instructions';
import {gameInitialState} from './Reducer/data';
import {appReducer} from './Reducer/appReducer';

function App() {
  const [state, dispatch] = useReducer(appReducer, gameInitialState );

  useEffect(() => {
    const getDeck = async () => {
      const url = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
      try {
        const res = await fetch(url);
        const data = await res.json();
      //GET DECK ID
        dispatch({type:"Get-DeckId", deckId: data?.deck_id})
      } catch(err) {
        console.error(err);
      }
    };
    if(state.play) {
      getDeck();
    }
  }, [state.play]);
  useEffect(() => {
    const start = async () => {
      if(!state.deckId) return;
      const url = `https://www.deckofcardsapi.com/api/deck/${state.deckId}/draw/?count=52`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        dispatch({type:"Set-Cards", cards:data.cards})
      } catch(err) {
        console.error(err);
        return err;
      }
    };
    if(state.deckId) {
      start();
    }
  }, [state.deckId]);

  useEffect(() => {
      const fetchTimes = async () => {
        try {
          const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_LOCALHOST ;
          const res = await fetch(`${url}/api/stats`);
          if(!res.ok) {
            throw new Error('no response');
          }
          const text = await res.json();
          dispatch({type: "Leaderboard", leader:"Text", leaders:text})
        } catch(err) {
          console.error('Fetch error:', err);
          return err;
        }
    }
      if(state.leaderboards){
        fetchTimes();
      }
  }, [state.leaderboards]);

  useEffect(() => {
    document.body.className = !state.play ? state.homeBgColor : state.gameBgColor;
  }, [state.play]);

  const sortedLeaders = state.leaders.sort((a, b) => {
    const timeA = a.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    const timeB = b.time.split(':').reduce((acc, time) => (60 * acc) + +time);
    return timeA - timeB;
  });
  return (
  <>
    <section className="items-center justify-center h-screen w-screen font-bold ">
      {state.instructions ? (
          <Instructions onClick={() => dispatch({type:"Instructions",btn:"Main", instructions:!state.instructions})} instructions={state.instructions} instructionDispatch={dispatch}/>
      ) : state.play ? (
          <Game cards={state.cards} play={state.play} gameDispatch={dispatch}/>        
      ) : state.leaderboards ? (    
          <Leaderboard  leaderboards={state.leaderboards} leaderboardDispatch={dispatch} sortedLeaders={sortedLeaders}/>    
      ) :( 
          <Menu instructions={state.instructions} play={state.play} menuDispatch={dispatch} leaderboards={state.leaderboards} leaderboardDispatch={dispatch} />
      )}
    </section>
  </>
  );
}
export default App;
