import { useState, useEffect, useReducer} from 'react';
import {Clock} from './Clock';
import { HomeBtn } from './Home-Btn';
import {ResetBtn} from './Reset-Btn';
import {Username} from './Username'
import {gameInitialState} from '../AppReducer/data';
import {gameReducer} from '../AppReducer/reducer';
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
export function Game({ cards,setPlay }) {
	const [state, dispatch] = useReducer(gameReducer,gameInitialState)
	const [deck, setDeck] = useState(backOfCard);
	// const [isSuddenDeath, setIsSuddenDeath] = useState(false);
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
	// const [back,setBack]= useState(false);
	const [userName, setUsername] = useState('');
	useEffect(() => {
		const showPlayers = () => {
			const playerOne = cards.slice(0, 6);
			const playerTwo = cards.slice(6, 12);
			const deck = cards.slice(12, cards.length);
			setPlayer({ one: playerOne, two: playerTwo, deck: deck });
			// setBack(true)
			dispatch({ type: "Showplayers",back: state.back })
		};
		const flipBack = setTimeout(() => {
			// setBack(false)
			dispatch({ type: "Flip-Back",  back:state.back })
			// console.log('FLIPPED CARD TO BACK')
		}, 600)
		dispatch({ type: "Flip-Back-SD", enableSuddenDeathPlayer: state.enableSuddenDeathPlayer, })
		// if(!state.enableSuddenDeathPlayer){	
			showPlayers();
		// }
		return () => clearTimeout(flipBack);
	}, [cards]);
	useEffect(() => {
		const flipCard = () => {
			if(player.deck.length > 0 && !state.back) {
				setDeck(player.deck[0].image);
				dispatch({type:"Flip-Front", disable:state.disable})
				// setDisable(false);
				// console.log('front-face')
			}
		};
		const interval = setInterval(() => {
			if(player.deck.length > 0){
				const topCard = player.deck[0];
				const valueTopcard = player.two.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(topCard) + cardSuit(topCard)))
			if(valueTopcard){
				flipCard();
				dispatch({ type:"Stop", stop: state.stop })
			}
				// setStop(false);
		}
		}, 1000);
		if(state.stop && !state.isSuddenDeath) {
			clearInterval(interval)
		} else {
			flipCard();
		}
		return () => clearInterval(interval);
	}, [player.two, player.deck, state.stop, state.isSuddenDeath, state.disable,state.back]);

	function handlePlayerTwo(card, i) {
		const value = cardValue(card);
		const suit = cardSuit(card);
		const deckValue = cardValue(player.deck[0]);
		const deckSuit = cardSuit(player.deck[0]);
		const totalDeckValue = deckValue + deckSuit;

		if(!state.isSuddenDeath) {
			if((value + suit) > totalDeckValue) {
				setPlayer(prev => ({
					...prev,
					deck: prev.deck.slice(1),
					one: [...prev.one, card,],
					two: prev.two.filter((_, index) => index !== i)
				}));
				dispatch({type:"PlayerTwo-!SD",disable:state.disable})
				// setDisable(true);
				console.log('greater than deck card')
			} else if((value + suit) === totalDeckValue) {
				return false;
			} else if((value + suit) < totalDeckValue) {
				// console.log('PlayerTwo all less than')
				return false;
			}
		}
		if(state.isSuddenDeath) {
			dispatch({type:"PlayerTwo-SD", stop:state.stop,disable:state.disable})
			// setDisable(false);
			// setStop(true);
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
		if(state.stop && player.two.length === 0 && player.deck.length > 0 && !state.isSuddenDeath){
			dispatch({type: "PlayerTwo-enableSD", enableSuddenDeathPlayer: state.enableSuddenDeathPlayer})
			// setEnableSuddenDeathPlayer(true)
			console.log(['enableSuddenDeath'])
		}
	},[player.two,state.stop,player.deck])
	useEffect(() => {
		if(player.deck.length > 0 && player.one.length > 0) {
			const deckCard = player.deck[0];
			if(player.two.length > 0 && player.one.length > 0 && deckCard) {
				const shouldEnableSuddenDeathPlayer = player.two.every(
					(card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)));
				
				const shouldEnableSuddenDeath = player.one.every(
					(card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)))
			
				if(shouldEnableSuddenDeathPlayer && shouldEnableSuddenDeath) {
					dispatch({type:"P1-P2-vs-Deck", enableSuddenDeathPlayer: state.enableSuddenDeathPlayer, disable:state.disable})
					// setEnableSuddenDeathPlayer(true);
					console.log('all items less than')
					// setDisable(false);
				}
			}
		}
	}, [player.one,player.two, player.deck, state.enableSuddenDeathPlayer, state.disable]);
	useEffect(() => {
		const deckCard = player.deck[0];
		const playerOneTurn = setTimeout(() => {
			if(deckCard) {
				if(!state.isSuddenDeath || player.deck.length === 0) {
					console.log('NOT SUDDEN DEATH ROUND REMOVE IF HAVE HIGHER CARD')
					setPlayer(prev => {
						const findCard = player.one.find((card) => (cardValue(card) + cardSuit(card)) > (cardValue(deckCard) + cardSuit(deckCard)))
						player.one.some((card, i, arr) => {
							if((cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)) && arr.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(deckCard) + cardSuit(deckCard)))) {
								console.log('ALL CARDS LESS THAN DECK CARDS');
								// return card
							}
							return false;
						});
						if(findCard && !state.isSuddenDeath) {
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
//FIX SUDDEN DEATH MODE ONCE PLAYER WON!!!
			if(state.isSuddenDeath && deathCards.length <= 0 && !state.stop) {
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
		if(player.deck.length > 0 && !state.isSuddenDeath) {
			if(player.one.length === 0 && player.deck.length >= 0) {
				setWinner(`YOU DON'T WIN!`);
				setDisable(true)
				console.log('COMPUTER WON');
			}else if(player.two.length === 0 && player.deck.length >= 0) {
				setWinner('YOU WIN!');
				clearTimeout(playerOneTurn)
				console.log('PLAYER WON');
			}
		}
		if(player.deck.length === 0 && !state.isSuddenDeath) {
			if(player.one.length < player.two.length) {
				setWinner(`YOU DON'T WIN!`);
				setDisable(true);
				console.log('WINNER COMPUTER');
			} else if(player.two.length < player.one.length) {
				setWinner('YOU WIN!');
				setDisable(true);
				console.log('WINNER PLAYER');
			}
		}
		if(state.stop && !state.isSuddenDeath && player.one.length > 0) {
			if(player.one.every((card) => (cardValue(card) + cardSuit(card)) < (cardValue(player.deck[0]) + cardSuit(player.deck[0])))) {
				clearTimeout(playerOneTurn);
				console.log('STOP INTERVAL');
				console.log(cardValue(player.deck[0]), cardSuit(player.deck[0]));
			}
		}
		return () => clearTimeout(playerOneTurn);
	}, [player.one, player.two, player.deck, state.stop, state.isSuddenDeath, state.enableSuddenDeathPlayer, winner,state.disable]);
	useEffect(() => {
		if(deathCards.length === 2 && state.isSuddenDeath && state.stop) {
			dispatch({type:"Enable-Card", disable: state.disable})
			compareDeathCards();
			// setDisable(sd => !sd);
		}
	}, [deathCards, state.isSuddenDeath, state.stop]);
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
			//POTENTIAL BUG FOUND STILL DOESN'T UPDATE AFTER SUDDEN DEATH ROUND IS DONE *state not being updated properly?*
				dispatch({ type: "SuddenDeath-Comp", isSuddenDeath: !state.isSuddenDeath})
			// setIsSuddenDeath(!isSuddenDeath);
			},1000)
			dispatch({type:'Resume-Round',enableSuddenDeathPlayer:state.enableSuddenDeathPlayer, stop:state.stop})
			// setEnableSuddenDeathPlayer(false);
			// setStop(false);
			console.log('Computer Wins');
			console.log(deathCards.length,'DCARDS.LENGTH')
		} else if((valueOne + valueOneSuit) < (valueTwo + valueTwoSuit)) {
			setTimeout(()=> {
			setPlayer((prev) => ({
				...prev,
				one: [...prev.one, ...deathCards],
				deck: prev.deck.slice(1)
			}));
			setDeathCards(deathCards.slice(2));
				dispatch({type:"SuddenDeath",isSuddenDeath: !state.isSuddenDeath})
			// setIsSuddenDeath(!isSuddenDeath);
			},1000)
			dispatch({ type: 'Resume-Round', enableSuddenDeathPlayer: state.enableSuddenDeathPlayer, stop: state.stop })
			// setEnableSuddenDeathPlayer(false);
			// setStop(false);
			console.log('DEathCards',deathCards.length)
		}
	};
	const suddenDeath = () => {
		dispatch({ type: "SuddenDeath-Round", isSuddenDeath: !state.isSuddenDeath })
		// setIsSuddenDeath(!isSuddenDeath);

	};
	const handleReset = () => {
    	// console.log('reset');
		dispatch({ type: "Reshuffle", enableSuddenDeathPlayer: state.enableSuddenDeathPlayer, isSuddenDeath: state.isSuddenDeath, stop: state.stop,disable:state.disable, back: state.back })
    	// setIsSuddenDeath(false);
    	setDeathCards([]);
    	setWinner('');
    	// setDisable(false);
    	// setStop(false);
    	// setBack(false);
    	// setEnableSuddenDeathPlayer(false);
    	const shuffledDeck = [...cards].sort(() => Math.random() - 0.5);
    	const playerOne = shuffledDeck.splice(0, 6);
    	const playerTwo = shuffledDeck.splice(0, 6);
    	const newDeck = shuffledDeck;
    	setPlayer({ one: playerOne, two: playerTwo, deck: newDeck });
    	setDeck(backOfCard); 
	};
	useEffect(() => {
		if(winner && userName.length === 3) {
			const postWinner = async () => {
				try {
					const url = import.meta.env.VITE_API_URL
					if(!url)console.error('No api')
					const res = await fetch(`${url}/api/username`, {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({
							text: userName,
							time: '00:59', // Replace with actual game time if available
						}),
					});
					const data = await res.json();
					console.log('Winner saved:', data);
				} catch(err) {
					console.error('Failed to save winner:', err);
				}
			};
			postWinner();
		}
	}, [winner, userName]);

	return (
		<>
			<div className="grid w-screen h-screen place-items-center">
				<div className="grid  w-screen max-w-screen max-h-screen h-screen p-1 ">
					<div className="grid grid-cols-3 items-center h-fit w-full pb-2">
						<button
							className="grid justify-center items-center border-2 rounded-full lg:w-full md:w-50 sm:w-full w-full md:h-8 lg:h-8 sm:h-10 bg-black text-black- lg:text-xl  md:text-xl sm:text-2xl text-xs font-extrabold border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(203,26,26)] to-[#682f2f] shadow-[0_4px_3px_#ff0000] active:translate-y-1 cursor-pointer place-self-center leading-tight"
							onClick={suddenDeath}
							disabled={!state.enableSuddenDeathPlayer || deathCards.length > 0}
						>
							SUDDEN DEATH
						</button>
						<div className="grid grid-cols-2 items-center place-items-center w-fit  lg:h-40 md:h-30 sm:h-30 h-fit gap-0">
							{deathCards.map((card, i) => (
								<img className="w-fit lg:h-40 md:h-30 sm:h-30 h-17" key={i} src={card.image} alt="Death Card" />
							))}
						</div>
						<Clock winner={winner} />
						<HomeBtn onClick={() => setPlay((p) => !p)}/>
						<ResetBtn className="grid justify-center items-center border-2 rounded-full lg:w-full md:w-50 sm:w-full w-full md:h-8 lg:h-8 sm:h-10 bg-black text-black- lg:text-xl  md:text-xl sm:text-2xl text-sm border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(203,26,26)] to-[#682f2f] shadow-[0_4px_3px_#ff0000] active:translate-y-1 cursor-pointer place-self-center leading-tight"
						 onResetClick={handleReset}/>
						<>'</>
					</div>
					<section className="grid grid-cols-3">
						<h2 className="text-center text-white text-lg font-bold">Computer</h2>
						<h2 className="text-center text-white text-lg font-bold">Deck</h2>
						<h2 className="text-center text-white text-lg font-bold">Player</h2>
					</section>
					<div className="grid grid-cols-3 justify-center lg:h-full md:h-full sm:h-full w-[98%] p-1 m-1">
						<div className="lg:grid md:flex sm:flex flex lg:grid-cols-7 md:flex-wrap sm:flex-wrap md:content-start  sm:content-start flex-wrap content-start justify-center w-full h-screen">
							{player.one.length > 0 && winner.length === 0 &&
								player.one.map((card,i) => (
									<li className='grid place-items-start lg:w-fit lg:max-h-full h-fit md:w-1/4 sm:w-1/4 w-1/2 m-0 p-0' key={i}>
										<input
											className=" grid  h-full max-h-full w-full max-w-full cursor-default  "
											type="image"
											alt="Card Image"
											src={state.isSuddenDeath && !deathCards[0] || state.back ? backOfCard : card.image}
										/>
									</li>
								))}
						</div>
						<div className="grid lg:place-items-center  md:place-items-center sm:place-items-center place-items-start justify-center w-full h-fit">
							{winner.length === 0 && player.deck.length > 0 && (
								<li className="grid ">
									<img className="lg:h-full md:h-50 sm:h-20 w-20  " alt="Card Image" src={deck} />
								</li>
							)}
							{winner === `YOU DON'T WIN!` && (
								<div className="grid place-items-center lg:text-7xl md:text-7xl sm:text-4xl text-4xl text-red-700 w-auto h-full max-w-full max-h-full animate-bounce">
									<h2>{winner}</h2>
								</div>
							)}

							{winner === "YOU WIN!" && (
								<div className="grid place-items-center lg:text-7xl md:text-7xl sm:text-4xl text-4xl text-green-700 w-auto h-full max-w-full max-h-full animate-bounce">
									<h2>{winner}</h2>
								</div>
							)}
						</div>
						<div className="lg:grid  md:flex sm:flex lg:grid-cols-7 md:flex-wrap sm:flex-wrap md:content-star sm:content-start flex flex-wrap content-start justify-center w-full">
							{/* <h2 className="text-center text-white text-lg font-bold">Player</h2> */}
							{player.two.length > 0 && winner.length === 0 &&
								player.two.map((card, i) => (
									<li className='grid place-items-start lg:w-full lg:max-h-full h-fit  md:w-1/4 sm:w-1/4 w-1/2 m-0 p-0' key={i}>
										<input
											className="grid h-full max-h-full w-full max-w-full "
											type="image"
											alt="Card Image"
											src={state.isSuddenDeath && !deathCards[1] || state.back ? backOfCard : card.image}
											onClick={() => handlePlayerTwo(card, i)}
											disabled={state.disable || (state.isSuddenDeath && deathCards.length < 1) || deathCards.length === 2 }
										/>
									</li>
								))}
						</div>

					</div>

				</div>
			</div>

		</>
	);
}
