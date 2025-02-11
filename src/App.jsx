import { useState, useEffect } from 'react';
import { Cards } from './components/Cards';
import { InstructionsBtn } from './components/InstructionsBtn'
import './App.css'

function App() {
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState('');
  const [play, setPlay] = useState(false);
  const [instructions, setInstructions] = useState(false);
  useEffect(() => {
    const getDeck = async () => {
      const url = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
      try {
        const res = await fetch(url)
        const data = await res.json();
        // console.log('data',data)
        setDeckId(data.deck_id);
      } catch(err) {
        console.error(err)
      }
    }
    if(play) {
      getDeck();
    }
  }, [play])

  useEffect(() => {
    const start = async () => {
      if(!deckId) return;
      const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCards(data.cards)
        // console.log('Cards',data.cards)
      } catch(err) {
        console.err(err)
      }
    }
    if(deckId) {
      start();
    }
  }, [deckId])

  const handleClick = () => {
    setInstructions(true);
  }
  return (
    <>
      {!play && !instructions ? (
        <div className='playBorder'>
    <h1 className='suddenDeath'>SUDDEN DEATH!</h1>
          <button
            className='playBtn'
            onClick={() => {
              setPlay(p => !p)
            }}>Play</button>
          <InstructionsBtn onClick={handleClick} value='Instructions' />
        </div>
      ) : (
        <>
          {!instructions &&
            <>
              <button
                className='homeBtn'
                onClick={() => {
                  setPlay(p => !p)
                }}
              >Home</button>
              <Cards cards={cards} />
            </>
          }
        </>
      )}
    </>
  )
}
export default App;

