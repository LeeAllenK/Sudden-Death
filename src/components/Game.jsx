import { useState, useEffect } from 'react';
import {Clock} from './Clock';
const backOfCard = `https://www.deckofcardsapi.com/static/img/back.png`;

function cardValue(card) {
	switch(card.value) {
		case 'JACK':
			return 11;
		case 'QUEEN':
			return 12;
		case 'KING':
			return 13;
		case 'ACE':
			return 50;
		default:
			return parseInt(card.value, 10);
	}
}
function cardSuit(card) {
	switch(card.suit) {
		case 'HEARTS':
			return 0;
		case 'DIAMONDS':
			return 12;
		case 'CLUBS':
			return 24;
		case 'SPADES':
			return 36;
		default:
			return parseInt(card.suit);
	}
}
export function Game({ cards }) {

	const [deck, setDeck] = useState(backOfCard);
	const [isSuddenDeath, setIsSuddenDeath] = useState(false);
	const [deathCards, setDeathCards] = useState([]);
	const [enableSuddenDeathPlayer, setEnableSuddenDeathPlayer] = useState(false);
	const [winner, setWinner] = useState('');
	const [disable, setDisable] = useState(false);
	const [stop, setStop] = useState(false)
	const [player, setPlayer] = useState({
		one: [],
		two: [],
		deck: []
	});
	const [back,setBack]= useState(false);
	useEffect(() => {

		const showPlayers = () => {
			const playerOne = cards.slice(0, 7);
			const playerTwo = cards.slice(7, 14);
			const deck = cards.slice(14, cards.length);
			setPlayer({ one: playerOne, two: playerTwo, deck: deck });
			setBack(true)
		};
		const flipBack = setTimeout(() => {
			setBack(false)
		}, 600)

		setEnableSuddenDeathPlayer(false)
		showPlayers();
		return () => clearTimeout(flipBack)
	}, [cards]);

	useEffect(() => {
		const flipCard = () => {
			if(player.deck.length > 0 && !back) {
				setDeck(player.deck[0].image);
				setDisable(false);
			}
		};
		const interval = setInterval(() => {
			if(player.deck.length > 0){
			if(player.two.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(player.deck[0]) + cardSuit(player.deck[0])))) {
				flipCard()
				setStop(false)
				// console.log('STOP INTERVAL');
			}
		}
		}, 1000);
		if(stop && !isSuddenDeath) {
			clearInterval(interval)
		} else {
			flipCard()
		}
		return () => clearInterval(interval);
	}, [player.two, player.deck, stop, isSuddenDeath, disable,back]);

	function handlePlayerTwo(card, i) {
		const value = cardValue(card);
		const suit = cardSuit(card);
		const deckValue = cardValue(player.deck[0]);
		const deckSuit = cardSuit(player.deck[0]);
		const totalDeckValue = deckValue + deckSuit;

		if(!isSuddenDeath) {
			if((value + suit) > totalDeckValue) {
				setPlayer(prev => ({
					...prev,
					deck: prev.deck.slice(1),
					one: [...prev.one, card,],
					two: prev.two.filter((_, index) => index !== i)
				}));
				setDisable(true);
			} else if((value + suit) === totalDeckValue) {
				return false;
			} else if((value + suit) < totalDeckValue) {
				return false;
			}
		}
		if(isSuddenDeath) {
			setDisable(false);
			setStop(true);
			setPlayer(prev => {
				const updateTwo = prev.two.filter((_, index) => index !== i);
				setDeathCards([...deathCards, prev.two[i]]);
				return {
					...prev,
					deck: prev.deck.slice(1),
					two: updateTwo
				};
			});
		}
	}
	useEffect(()=>{
		if(stop && player.two.length === 0 && player.deck.length > 0 && !isSuddenDeath){
			setEnableSuddenDeathPlayer(true)
		}
	},[player.two,stop,player.deck])
	useEffect(() => {
		if(player.deck.length > 0 && player.one.length > 0) {
			const deckCard = player.deck[0];
			if(player.two.length > 0 && player.one.length > 0 && deckCard) {
				const shouldEnableSuddenDeathPlayer = player.two.every(
					(card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)));
				
				const shouldEnableSuddenDeath = player.one.every(
					(card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)))
			
				if(shouldEnableSuddenDeathPlayer && shouldEnableSuddenDeath) {
					setEnableSuddenDeathPlayer(true);
					console.log('all items less than')
					setDisable(false);
				}
			}
		}
	}, [player.one,player.two, player.deck, enableSuddenDeathPlayer, disable]);
	useEffect(() => {
		const deckCard = player.deck[0];
		const playerOneTurn = setTimeout(() => {
			if(deckCard) {
				if(!isSuddenDeath || player.deck.length === 0) {
					setPlayer(prev => {
						if(player.one.length === player.two.length){
							return{
								...prev,
								one: prev.one.slice(1)
							}
						}
						const findCard = player.one.find((card) => (cardValue(card) + cardSuit(card)) > (cardValue(deckCard) + cardSuit(deckCard)))
						player.one.some((card, i, arr) => {
							if((cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)) && arr.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)))) {
								console.log('ALL CARDS LESS THAN DECK CARDS');
							}
							return false;
						});
						if(findCard && !isSuddenDeath) {
							return {
								...prev,
								one: prev.one.filter((card) => card !== findCard),
								two: [...prev.two, findCard],
								deck: prev.deck.slice(1)
							};
						}
						return prev;
					});
				}
			}	
			if(isSuddenDeath && deathCards.length <= 0 && !stop) {
				if(player.one.length > 0){
				const maxCardValue = Math.max(...player.one.map(card => cardValue(card) + cardSuit(card)));
				const maxCard = player.one.find(card => cardValue(card) + cardSuit(card) === maxCardValue);
				const updatedDeathCards = [maxCard, ...deathCards];
				const updatedPlayerOneHand = player.one.filter(card => cardValue(card) + cardSuit(card) !== maxCardValue);
				setDeathCards(updatedDeathCards);
				setPlayer((prev) => {
					return {
						...prev,
						one: updatedPlayerOneHand
					};
				});
				}
			}
		}, 1550);
		if(player.deck.length > 0 && !isSuddenDeath) {
			if(player.one.length === 0 && player.deck.length >= 0) {
				setWinner('COMPUTER WINS!');
				setDisable(true)
				console.log('COMPUTER WON');
			}else if(player.two.length === 0 && player.deck.length >= 0) {
				setWinner('YOU WIN!');
				clearTimeout(playerOneTurn)
				console.log('PLAYER WON');
			}
		}
		if(player.deck.length === 0 && !isSuddenDeath) {
			if(player.one.length < player.two.length) {
				setWinner('COMPUTER WINS!');
				setDisable(true);
				console.log('WINNER COMPUTER');
			} else if(player.two.length < player.one.length) {
				setWinner('YOU WIN!');
				setDisable(true);
				console.log('WINNER PLAYER');
			}
		}
		if(stop && !isSuddenDeath && player.one.length > 0) {
			if(player.one.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(player.deck[0]) + cardSuit(player.deck[0])))) {
				clearTimeout(playerOneTurn);
				console.log('STOP INTERVAL');
				console.log(cardValue(player.deck[0]), cardSuit(player.deck[0]));
			}
		}
		return () => clearTimeout(playerOneTurn);
	}, [player.one, player.two, player.deck, stop, isSuddenDeath, enableSuddenDeathPlayer, winner,disable]);
	useEffect(() => {
		if(deathCards.length === 2 && isSuddenDeath && stop) {
			compareDeathCards();
			setDisable(sd => !sd)
			console.log('s', stop)
		}
	}, [deathCards, isSuddenDeath, disable, stop]);
	const compareDeathCards = () => {
		const [cardOne, cardTwo] = deathCards;
		const valueOne = cardValue(cardOne);
		const valueOneSuit = cardSuit(cardOne);
		const valueTwo = cardValue(cardTwo);
		const valueTwoSuit = cardSuit(cardTwo);
		if((valueOne + valueOneSuit) > (valueTwo + valueTwoSuit)) {
			setTimeout(() => {
			setPlayer((prev) => {
				return {
					...prev,
					one: prev.one.filter((card) => card !== cardOne),
					two: [...prev.two, ...deathCards],
					deck: prev.deck
				};
			});

			setDeathCards(deathCards.slice(2));
			setIsSuddenDeath(!isSuddenDeath);
			},1000)
			setEnableSuddenDeathPlayer(false);
			setStop(false);
			console.log('Computer Wins');
		} else if((valueOne + valueOneSuit) < (valueTwo + valueTwoSuit)) {
			setTimeout(()=> {
			setPlayer((prev) => ({
				...prev,
				one: [...prev.one, ...deathCards],
				deck: prev.deck.slice(1)
			}));
			setDeathCards(deathCards.slice(2));
			setIsSuddenDeath(!isSuddenDeath);
			},1000)
			setEnableSuddenDeathPlayer(false);
			setStop(false);
		}
	};
	const suddenDeath = () => {
		setIsSuddenDeath(!isSuddenDeath);

	};
	return (
		<>
			<ul className='flex flex-col justify-center items-center lg:h-screen lg:w-screen '>
			{player.one && player.two && player.deck &&
					<div className='flex lg:w-300 justify-end'><Clock winner={winner}/></div>
			}
				<div className='flex justify-center lg:h-40'>
				{deathCards.map((card, i) => (
					<img className='lg:h-40'key={i} src={card.image} alt='Death Card'/>
				))}
				</div>
				{enableSuddenDeathPlayer && deathCards.length <= 0 && 
				<div className='flex justify-center '>
				<button className='border-2 rounded-full lg:w-100 lg:h-10 bg-black text-red-700 text-3xl'onClick={suddenDeath} disabled={isSuddenDeath }>SUDDEN DEATH</button>
				</div>
				}
				{player.one && player.two ? (
					<>
						<div className='flex  flex-row flex-wrap lg:w-200 justify-start mt-2 lg:h-40'>
							{player.one.length > 0 && winner.length === 0 &&
								player.one.map((card, i) => (
									<li className='playerOneCards' key={card.image}>
										<img
											className='lg:h-25'
											alt='Card Image'
											src={isSuddenDeath && !deathCards[0] || back? backOfCard : card.image}
										/>
									</li>
								))
							}
							{winner === 'COMPUTER WINS!'&& (
								<div className='text-8xl animate-bounce '><h2 >{winner}</h2></div>
							)}
						</div>
					<div className='flex justify-end items-center lg:w-300 lg:h-40 '>
						<li className='flex '>
							{player.deck.length > 0 &&
								<img
									className='lg:h-40'
									alt='Card Image'
									src={deck}
								/>
							}
						</li>
					</div>
						<div className='flex flex-row flex-wrap lg:h-40 lg:w-200 justify-start'>
							{player.two.length > 0 && winner.length === 0 &&
								player.two.map((card, i) => (
									<li className='' key={card.image}>
										<input
											className='lg:h-25'
											type='image'
											alt='Card Image'
											src={isSuddenDeath && !deathCards[1] || back? backOfCard : card.image}
											onClick={() => handlePlayerTwo(card, i)}
											disabled={disable ||(isSuddenDeath && deathCards.length === 0)}
										/>
									</li>
								))
							}
							{winner === 'YOU WIN!' && (
								<h2 className='text-8xl animate-bounce'><br/>{winner}</h2>
							)}

						</div>
					</>
				) : (
					<>Loading....</>
				)}
			</ul>
		</>
	);
}
