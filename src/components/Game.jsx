
import { useState, useEffect, useReducer } from 'react';
import { Clock } from './Clock';
import { HomeBtn } from './Home-Btn';
import { ResetBtn } from './Reset-Btn';
import {gameInitialState} from '../AppReducer/data';
import {gameReducer} from '../AppReducer/reducer';

const backOfCard = `https:www.deckofcardsapi.com/static/img/back.png`;

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
export function Game({ cards, setPlay }) {
	const [state, dispatch] = useReducer(gameReducer,gameInitialState)
	const [deck, setDeck] = useState(backOfCard);
	// const [isSuddenDeath, setIsSuddenDeath] = useState(false);
	const [deathCards, setDeathCards] = useState([]);
	// const [enableSuddenDeathPlayer, setEnableSuddenDeathPlayer] = useState(false);
	// const [winner, setWinner] = useState('');
	// const [disable, setDisable] = useState(false);
	// const [stop, setStop] = useState(false)
	const [player, setPlayer] = useState({
		one: [],
		two: [],
		deck: []
	});
	// const [back, setBack] = useState(false);
	//CARD IMAGE PROBLEM WHEN DEPLOYED
	useEffect(() => {
		cards.forEach(card => {
			const img = new Image();
			img.src = card.image;
		});
		
	}, [cards]);

	useEffect(() => {
		const showPlayers = () => {
			// const playerOne = cards.slice(0, 6);
			// const playerTwo = cards.slice(6, 12);
			// const deck = cards.slice(12, cards.length);
			const playerOne = cards.slice(0, 6).map(c => ({ ...c, image: c.image }));
			const playerTwo = cards.slice(6, 12).map(c => ({ ...c, image: c.image }));
			const deck = cards.slice(12).map(c => ({ ...c, image: c.image }));
			// setPlayer({ one: playerOne, two: playerTwo, deck: deck });
			dispatch({ type: "Assign-Cards", back: state.back, player: { one: playerOne, two: playerTwo, deck: deck }})
			// setBack(true)
		};
		const flipBack = setTimeout(() => {
			dispatch({type:"Flipcard-Back",back: state.back})
			// setBack(false)
		}, 600)
		dispatch({type:"ShowPlayers", enableSuddenDeathPlayer:state.enableSuddenDeathPlayer})
		// setEnableSuddenDeathPlayer(false);
		showPlayers();
		return () => clearTimeout(flipBack);
	}, [cards]);

	useEffect(() => {
		const flipCard = () => {
			if(state.player?.deck?.length > 0 && !state.back) {
				// setDeck(player.deck[0].image);
				dispatch({type:"Flipcard-Face",backImage: state.player.deck[0].image, disable: state.disable})
				// setDisable(false);
			}
		};
		const interval = setInterval(() => {
			if(state.player?.deck?.length > 0) {
				if(state.player.two.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(state.player.deck[0]) + cardSuit(state.player.deck[0])))) {
					dispatch({type:"Flip-Card",stop:state.stop})
					// setStop(false);
					flipCard();
				}
			}
		}, 1000);
		if(state.stop && !state.isSuddenDeath) {
			clearInterval(interval)
		} else {
			flipCard();
		}
		return () => clearInterval(interval);
	}, [state.player.two, state.player.deck, state.stop, state.isSuddenDeath, state.disable, state.back]);

	function handlePlayerTwo(card, i) {
		const value = cardValue(card);
		const suit = cardSuit(card);
		const deckValue = cardValue(state.player.deck[0]);
		const deckSuit = cardSuit(state.player.deck[0]);
		const totalDeckValue = deckValue + deckSuit;

		if(!state.isSuddenDeath) {
			if((value + suit) > totalDeckValue) {
				// setPlayer(prev => ({
				// 	...prev,
				// 	deck: prev.deck.slice(1),
				// 	one: [...prev.one, card],
				// 	two: prev.two.filter((_, index) => index !== i)
				// }));
				dispatch({ type: "PlayerTwo-Comp-Card", disable: state.disable, player: {...state.player, one: [...state.player.one, card], two: state.player.two.filter((_, index) => index !== i), deck: state.player.deck.slice(1) } })
				// setDisable(true);
			} else if((value + suit) === totalDeckValue) {
				return false;
			} else if((value + suit) < totalDeckValue) {
				return false;
			}
		}
		if(state.isSuddenDeath) {
			const updateTwo = state.two?.filter((_, index) => index !== i);
			const chosenCard = state.player?.two?.[i];
			dispatch({ type: "PlayerTwo-SD-Comp-Card", disable: state.disable, stop: state.stop, player:{...state.player,one: state.player.one, two: state.player.two.filter((_, index) => index !== i), deck: state.player.deck.slice(1)},deathCards:[...state.deathCards,chosenCard]})
			// setDisable(false);
			// setStop(true);
			// setPlayer(prev => {
			// 	const updateTwo = prev.two.filter((_, index) => index !== i);
			// 	setDeathCards([...deathCards, prev.two[i]]);
			// 	return {
			// 		...prev,
			// 		deck: prev.deck.slice(1),
			// 		two: updateTwo
			// 	};
			// });
		}
	}
	useEffect(() => {
		if(state.stop && state.player.two.length === 0 && state.player.deck.length > 0 && !state.isSuddenDeath) {
			dispatch({type:"SD-Player", enableSuddenDeathPlayer:true})
			// setEnableSuddenDeathPlayer(true)
		}
	}, [state.player.two, state.stop, state.player.deck])
	useEffect(() => {
		if(state.player?.deck?.length > 0 && state.player?.one?.length > 0) {
			const deckCard = state.player?.deck?.[0];
			if(state.player.two.length > 0 && state.player.one.length > 0 && deckCard) {
				const shouldEnableSuddenDeathPlayer = state.player.two.every(
					(card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)));

				const shouldEnableSuddenDeath = state.player.one.every(
					(card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)))

				if(shouldEnableSuddenDeathPlayer && shouldEnableSuddenDeath) {
					// setEnableSuddenDeathPlayer(true);
					console.log('all items less than')
					dispatch({type:"Enable-SuddenDeathPlayer",enableSuddenDeathPlayer:state.enableSuddenDeathPlayer, disable:state.disable})
					// setDisable(false);
				}
			}
		}//BUG FIX SD ROUND
			if(state.enableSuddenDeathPlayer){
					console.log('YES')
				dispatch({type:"Start-SD-Round", isSuddenDeath: state.isSuddenDeath})
				// setIsSuddenDeath(true);
			}
	}, [state.player.one, state.player.two, state.player.deck, state.enableSuddenDeathPlayer,state.isSuddenDeath, state.disable]);
	useEffect(() => {
		const deckCard = state.player?.deck?.[0];
		const playerOneTurn = setTimeout(() => {
			if(deckCard) {
				if(!state.isSuddenDeath || state.player?.deck?.length === 0) {
					// setPlayer(prev => {
					// 	const findCard = state.player.one.find((card) => (cardValue(card) + cardSuit(card)) > (cardValue(deckCard) + cardSuit(deckCard)))
					// 	state.player.one.some((card, i, arr) => {
					// 		if((cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)) && arr.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)))) {
					// 			console.log('ALL CARDS LESS THAN DECK CARDS');
					// 		}
					// 		return false;
					// 	});
					// 	if(findCard && !state.isSuddenDeath) {
					// 		return {
					// 			...prev,
					// 			one: prev.one.filter((card) => card !== findCard),
					// 			two: [...prev.two, findCard],
					// 			deck: prev.deck.slice(1)
					// 		};
					// 	}
					// 	return prev;
					// });
					// compute next player state outside reducer
					const findCard = state.player.one.find(
						(card) =>
							cardValue(card) + cardSuit(card) >
							cardValue(deckCard) + cardSuit(deckCard)
					);

					state.player.one.some((card, i, arr) => {
						if(
							cardValue(card) + cardSuit(card) <
							cardValue(deckCard) + cardSuit(deckCard) &&
							arr.every(
								(c) =>
									cardValue(c) + cardSuit(c) <
									cardValue(deckCard) + cardSuit(deckCard)
							)
						) {
							console.log("ALL CARDS LESS THAN DECK CARDS");
						}
						return false;
					});

					let updatedPlayer = state.player;

					if(findCard && !state.isSuddenDeath) {
						updatedPlayer = {
							...state.player,
							one: state.player?.one?.filter((card) => card !== findCard),
							two: [...state.player.two, findCard],
							deck: state.player?.deck?.slice(1),
						};
					}
					// now dispatch with the computed player state
					dispatch({
						type: "Player-Move",
						player: updatedPlayer,
						disable: state.disable,
						stop: state.stop,
					});

				}
			}
			if(state.isSuddenDeath && state.deathCards.length <= 0 && !state.stop) {
				if(state.player.one.length > 0) {
					const maxCardValue = Math.max(...state.player.one.map(card => cardValue(card) + cardSuit(card)));
					const maxCard = state.player.one.find(card => cardValue(card) + cardSuit(card) === maxCardValue);
					const updatedDeathCards = [maxCard, ...state.deathCards];
					const updatedPlayerOneHand = state.player.one.filter(card => cardValue(card) + cardSuit(card) !== maxCardValue);
					// setDeathCards(updatedDeathCards);
					// setPlayer((prev) => {
					// 	return {
					// 		...prev,
					// 		one: updatedPlayerOneHand
					// 	};
					// });
					dispatch({type:"PlayerOne-Deathcard", deathCards:updatedDeathCards})
					dispatch({type:"SD-Card-PlayerOne", player:{...state.player, one:updatedPlayerOneHand, two:state.player.two, deck:state.player.deck},})
				}
			}
		}, 1550);
		if(state.player?.deck?.length > 0 && !state.isSuddenDeath) {
			if(state.player.one.length === 0 && state.player.deck.length >= 0) {
				// setWinner(`YOU DON'T WIN!`);
				dispatch({ type: "Winner", disable: state.disable, winner: `YOU DON'T WIN!` })
				// setDisable(true)
				console.log('COMPUTER WON');
			} else if(state.player.two.length === 0 && state.player.deck.length >= 0) {
				dispatch({type:"Winner-PlayerOneTurn", winner: `YOU WIN!`})
				// setWinner('YOU WIN!');
				clearTimeout(playerOneTurn)
				console.log('PLAYER WON');
			}
		}
		if(state.player?.deck?.length === 0 && !state.isSuddenDeath) {
			if(state.player.one.length < state.player.two.length) {
				// setWinner(`YOU DON'T WIN!`);
				dispatch({ type: "Winner", disable: state.disable, winner: `YOU DON'T WIN!`})
				// setDisable(true);
				console.log('WINNER COMPUTER');
			} else if(state.player.two.length < state.player.one.length) {
				// setWinner('YOU WIN!');
				dispatch({ type: "Winner", disable: state.disable, winner: `YOU WIN!`})
				// setDisable(true);
				console.log('WINNER PLAYER');
			}
		}
		if(state.stop && !state.isSuddenDeath && state.player.one.length > 0) {
			if(state.player.one.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(state.player.deck[0]) + cardSuit(state.player.deck[0])))) {
				clearTimeout(playerOneTurn);
				console.log('STOP INTERVAL');
				console.log(cardValue(state.player.deck[0]), cardSuit(state.player.deck[0]));
			}
		}
		return () => clearTimeout(playerOneTurn);
	}, [state.player.one, state.player.two, state.player.deck, state.stop, state.isSuddenDeath, state.enableSuddenDeathPlayer, state.winner, state.disable]);
	useEffect(() => {
		if(state.deathCards.length === 2 && state.isSuddenDeath && state.stop) {
			dispatch({type:"Compare-DeathCards",disable: state.disable})
			compareDeathCards();
			// setDisable(sd => !sd)
			console.log('STOOOOOOOOOOOOOOOOOOOOOOOOOOOOOP', state.stop)
		}
	}, [state.deathCards, state.isSuddenDeath, state.disable, state.stop]);
	const compareDeathCards = () => {
		const [cardOne, cardTwo] = state.deathCards;
		const valueOne = cardValue(cardOne);
		const valueOneSuit = cardSuit(cardOne);
		const valueTwo = cardValue(cardTwo);
		const valueTwoSuit = cardSuit(cardTwo);
		if((valueOne + valueOneSuit) > (valueTwo + valueTwoSuit)) {
			setTimeout(() => {
				// setPlayer((prev) => {
				// 	return {
				// 		...prev,
				// 		one: prev.one.filter((card) => card !== cardOne),
				// 		two: [...prev.two, ...state.deathCards],
				// 		deck: prev.deck
				// 	};
				// });
				dispatch({ type: "Winner-DC", player: { ...state.player, one: state.player.one.filter((card) => card !== cardOne), two:[...state.player.two,...state.deathCards] , deck: state.player.deck.slice(1)},deathCards:state.deathCards.slice(2)})
				// setDeathCards(deathCards.slice(2));
				dispatch({type: "Comp-Deathcards-Win", isSuddenDeath: !state.isSuddenDeath})
				// setIsSuddenDeath(!state.isSuddenDeath);
			}, 1000)
			dispatch({type:"Comp-Deathcards-End", enableSuddenDeathPlayer:state.enableSuddenDeathPlayer,stop:state.stop})
			// setEnableSuddenDeathPlayer(false);
			// setStop(false);
			console.log('Computer Wins');
		} else if((valueOne + valueOneSuit) < (valueTwo + valueTwoSuit)) {
			setTimeout(() => {
				// setPlayer((prev) => ({
				// 	...prev,
				// 	one: [...prev.one, ...deathCards],
				// 	deck: prev.deck.slice(1)
				// }));
				dispatch({ type:"Winner-DC-Player", player: { ...state.player, one: [...state.player.one, ...deathCards], deck: state.player?.deck?.slice(1)},deathCards:state.deathCards.slice(2)})
				// setDeathCards(deathCards.slice(2));
				dispatch({ type: "Comp-Deathcards-Win", isSuddenDeath:!state.isSuddenDeath })
				// setIsSuddenDeath(!state.isSuddenDeath);
			}, 1000)
			dispatch({ type: "Comp-Deathcards-End", enableSuddenDeathPlayer: state.enableSuddenDeathPlayer, stop:state.stop})
			// setEnableSuddenDeathPlayer(false);
			// setStop(false);
		}
	};
	const handleReset = () => {
		const shuffledDeck = [...cards].sort(() => Math.random() - 0.5);
		const playerOne = shuffledDeck.splice(0, 6);
		const playerTwo = shuffledDeck.splice(0, 6);
		const newDeck = shuffledDeck;
		console.log('reset');
		dispatch({type:"Reshuffle-Cards",player:{...state.player, one: playerOne, two: playerTwo, deck: newDeck}, isSuddenDeath: state.isSuddenDeath,enableSuddenDeathPlayer:state.enableSuddenDeathPlayer,backImage:state.backImage, disable:state.disable,stop:state.stop, back: false, winner: '',deathCards:state.deathCards})
		// setIsSuddenDeath(false);
		// setDeathCards([]);
		// setWinner('');
		// setDisable(false);
		// setStop(false);
		// setBack(false);
		// setEnableSuddenDeathPlayer(false);
		// setPlayer({ one: playerOne, two: playerTwo, deck: newDeck });
		// setDeck(backOfCard);
	};
	return (
 		<>
 			<section className="grid w-screen h-screen place-items-center">
				<section className="grid  w-screen max-w-screen max-h-screen h-screen p-1 ">
 					<section className="grid grid-cols-3 items-center h-fit w-full pb-2">
 						<Clock winner={state.winner} />
 						<div className="grid grid-cols-2 items-center place-items-center w-fit  lg:h-40 md:h-30 sm:h-30 h-fit gap-0">
 							{state.deathCards.map((card, i) => (
 								<img className="w-fit lg:h-40 md:h-30 sm:h-30 h-17" key={i} src={card?.image} alt="Death Card" />
 							))}
 						</div>
 						<HomeBtn onClick={() => setPlay((p) => !p)}/>
 						<ResetBtn className="grid justify-center items-center border-2 rounded-full lg:w-full md:w-50 sm:w-full w-full md:h-8 lg:h-8 sm:h-10 bg-black text-black- lg:text-xl  md:text-xl sm:text-2xl text-sm border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(203,26,26)] to-[#682f2f] shadow-[0_4px_3px_#ff0000] active:translate-y-1 cursor-pointer place-self-center leading-tight"
 						 onResetClick={handleReset}/>
 						
 					</section>
 					<section className="grid grid-cols-3">
 						<h2 className="text-center text-white text-lg font-bold">Computer</h2>
 						<h2 className="text-center text-white text-lg font-bold">Deck</h2>
 						<h2 className="text-center text-white text-lg font-bold">Player</h2>
 					</section>
 					<section className="grid grid-cols-3 justify-center lg:h-full md:h-full sm:h-full w-[98%] p-1 m-1">
 						<div className="lg:grid md:flex sm:flex flex lg:grid-cols-7 md:flex-wrap sm:flex-wrap md:content-start  sm:content-start flex-wrap content-start justify-center w-full h-screen">
 							{state.player?.one?.length > 0 && state.winner.length === 0 &&
 								state.player.one.map((card,i) => (
 									<li className='grid place-items-start lg:w-fit lg:max-h-full h-fit md:w-1/4 sm:w-1/4 w-1/2 m-0 p-0' key={i}>
 										<input
 											className=" grid  h-full max-h-full w-full max-w-full cursor-default  "
 											type="image"
 											alt="Card Image"
 											src={(state.isSuddenDeath && !state.deathCards[0]) || state.back ? backOfCard : card?.image}
 										/>
 									</li>
 								))}
 						</div>
 						<div className="grid lg:place-items-center  md:place-items-center sm:place-items-center place-items-start justify-center w-full h-fit">
 							{state.winner?.length === 0 && state.player?.deck?.length > 0 && (
 								<li className="grid ">
 									<img className="lg:h-full md:h-50 sm:h-20 w-20  " alt="Card Image" src={state.backImage} />
 								</li>
 							)}
 							{state.winner === `YOU DON'T WIN!` && (
 								<div className="grid place-items-center lg:text-7xl md:text-7xl sm:text-4xl text-4xl text-red-700 w-auto h-full max-w-full max-h-full animate-bounce">
 									<h2>{state.winner}</h2>
 								</div>
 							)}

 							{state.winner === "YOU WIN!" && (
 								<div className="grid place-items-center lg:text-7xl md:text-7xl sm:text-4xl text-4xl text-green-700 w-auto h-full max-w-full max-h-full animate-bounce">
 									<h2>{state.winner}</h2>
 								</div>
 							)}
 						</div>
 						<div className="lg:grid  md:flex sm:flex lg:grid-cols-7 md:flex-wrap sm:flex-wrap md:content-star sm:content-start flex flex-wrap content-start justify-center w-full">
 							{/* <h2 className="text-center text-white text-lg font-bold">Player</h2> */}
 							{state.player?.two?.length > 0 && state.winner?.length === 0 &&
 								state.player.two.map((card, i) => (
 									<li className='grid place-items-start lg:w-full lg:max-h-full h-fit  md:w-1/4 sm:w-1/4 w-1/2 m-0 p-0' key={i}>
 										<input
 											className="grid h-full max-h-full w-full max-w-full "
 											type="image"
 											alt="Card Image"
												src={state.back
													? backOfCard
													: state.isSuddenDeath && !state.deathCards[1]
														? backOfCard
														: card?.image}
 											onClick={() => handlePlayerTwo(card, i)}
 											disabled={state.disable || (state.isSuddenDeath && state.deathCards.length < 1) || state.deathCards.length === 2 }
											onError={(e) => { e.currentTarget.src = backOfCard; }}
 										/>
 									</li>
 								))}
 						</div>
 					</section>
 				</section>
 			</section>
 		</>
 	);
 }