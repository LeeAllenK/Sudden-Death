import { useState, useEffect } from 'react';
import {Clock} from './Clock';
import { HomeBtn } from './Home-Btn';
import {ResetBtn} from './Reset-Btn';
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
			const playerOne = cards.slice(0, 6);
			const playerTwo = cards.slice(6, 12);
			const deck = cards.slice(12, cards.length);
			setPlayer({ one: playerOne, two: playerTwo, deck: deck });
			setBack(true)
		};
		const flipBack = setTimeout(() => {
			setBack(false)
		}, 600)

		setEnableSuddenDeathPlayer(false);
		showPlayers();
		return () => clearTimeout(flipBack);
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
				flipCard();
				setStop(false);
			}
		}
		}, 1000);
		if(stop && !isSuddenDeath) {
			clearInterval(interval)
		} else {
			flipCard();
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
				setWinner(`YOU DON'T WIN!`);
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
				setWinner(`YOU DON'T WIN!`);
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
	const handleReset = () => {
    	console.log('reset');
    	setIsSuddenDeath(false);
    	setDeathCards([]);
    	setWinner('');
    	setDisable(false);
    	setStop(false);
    	setBack(false);
    	setEnableSuddenDeathPlayer(false);
    	const shuffledDeck = [...cards].sort(() => Math.random() - 0.5);
    	const playerOne = shuffledDeck.splice(0, 6);
    	const playerTwo = shuffledDeck.splice(0, 6);
    	const newDeck = shuffledDeck;
    	setPlayer({ one: playerOne, two: playerTwo, deck: newDeck });
    	setDeck(backOfCard); 
	};
	
	return (
		<>
			<div className="grid w-screen h-screen place-items-center">
				<div className="grid  w-screen max-w-screen max-h-screen h-screen p-1 ">
					<div className="grid grid-cols-3 items-center h-fit w-full pb-2">
						<button
							className="grid justify-center items-center border-2 rounded-full lg:w-full md:w-50 sm:w-full w-full md:h-8 lg:h-8 sm:h-10 bg-black text-black- lg:text-xl  md:text-xl sm:text-2xl text-sm border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(203,26,26)] to-[#682f2f] shadow-[0_4px_3px_#ff0000] active:translate-y-1 cursor-pointer place-self-center leading-tight"
							onClick={suddenDeath}
							disabled={!enableSuddenDeathPlayer || deathCards.length > 0}
						>
							SUDDEN DEATH
						</button>
						<div className="grid grid-cols-2 items-center place-items-center w-full lg:h-40 md:h-30 sm:h-30 h-20 gap-0">
							{deathCards.map((card, i) => (
								<img className="w-fit lg:h-40 md:h-30 sm:h-30 h-17" key={i} src={card.image} alt="Death Card" />
							))}
						</div>
						<Clock winner={winner} />
						<HomeBtn onClick={() => setPlay((p) => !p)}/>
						<ResetBtn className="grid justify-center items-center border-2 rounded-full lg:w-full md:w-50 sm:w-full w-full md:h-8 lg:h-8 sm:h-10 bg-black text-black- lg:text-xl  md:text-xl sm:text-2xl text-sm border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(203,26,26)] to-[#682f2f] shadow-[0_4px_3px_#ff0000] active:translate-y-1 cursor-pointer place-self-center leading-tight"
						 onResetClick={handleReset}/>
						<>'</>
						<h2 className="text-center text-white text-lg font-bold">Computer</h2>
						<h2 className="text-center text-white text-lg font-bold">Deck</h2>
						<h2 className="text-center text-white text-lg font-bold">Player</h2>
					</div>
					<div className="grid grid-cols-3 justify-center lg:h-full md:h-full sm:h-full w-[98%] p-1 m-1">
						<div className="lg:grid md:flex sm:flex flex lg:grid-cols-7 md:flex-wrap sm:flex-wrap md:content-start  sm:content-start flex-wrap content-start justify-center w-full">
							{player.one.length > 0 && winner.length === 0 &&
								player.one.map((card) => (
									<li className='grid place-items-start lg:w-fit lg:max-h-full h-fit md:w-1/4 sm:w-1/4 w-1/2 m-0 p-0' key={card.image}>
										<input
											className=" grid  h-full max-h-full w-full max-w-full cursor-default  "
											type="image"
											alt="Card Image"
											src={isSuddenDeath && !deathCards[0] || back ? backOfCard : card.image}
										/>
									</li>
								))}
						</div>
						<div className="grid lg:place-items-center  md:place-items-center sm:place-items-center place-items-start justify-center w-full h-fit">
							{winner.length === 0 && player.deck.length > 0 && (
								<li className="grid ">
									<img className="lg:h-fit md:h-full sm:h-40 max-h-fit " alt="Card Image" src={deck} />
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
									<li className='grid place-items-start lg:w-full lg:max-h-full h-fit  md:w-1/4 sm:w-1/4 w-1/2 m-0 p-0' key={card.image}>
										<input
											className="grid h-full max-h-full w-full max-w-full "
											type="image"
											alt="Card Image"
											src={isSuddenDeath && !deathCards[1] || back ? backOfCard : card.image}
											onClick={() => handlePlayerTwo(card, i)}
											disabled={disable || (isSuddenDeath && deathCards.length < 1) || deathCards.length === 2 }
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
