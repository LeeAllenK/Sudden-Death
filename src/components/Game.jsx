import { useState, useEffect } from 'react';
import {Clock} from './Clock';
import { HomeBtn } from './Home-Btn';
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
	return (
		<>
			<ul className="grid w-screen h-screen place-items-center">
				{player.one && player.two && player.deck && (
					<div className="grid items-end w-screen h-37 grid-cols-3 ">
						<HomeBtn onClick={() => setPlay((p) => !p)} />
						<div className="grid grid-cols-[repeat(2,minmax(0,100px))] justify-center  w-full lg:h-37">
					{deathCards.map((card, i) => (
						<img className="grid w-full  lg:h-35  md:h-20" key={i} src={card.image} alt="Death Card" />
					))}
				</div>
						<Clock winner={winner} />
					</div>
				)}


				{enableSuddenDeathPlayer && deathCards.length === 0 && (
					<div className="grid justify-center md:w-200 md:pl-40 pb-3">
						<button
							className="border-2 rounded-full lg:w-90 md:w-70 md:h-8 lg:h-8 bg-black text-red-700 lg:text-2xl md:text-xl border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(0,0,0)] to-[#2f2e2e] shadow-[0_4px_3px_#ff0000] active:translate-y-1 cursor-pointer"
							onClick={suddenDeath}
							disabled={isSuddenDeath}
						>
							SUDDEN DEATH
						</button>
					</div>
				)}

				{player.one && player.two ? (
					<>
						<div className="grid grid-cols-[repeat(8,minmax(0,100px))] lg:w-screen justify-center lg:h-80 md:h-40  md:w-150 md:-ml-50 ">
							{player.one.length > 0 && winner.length === 0 &&
								player.one.map((card) => (
									<li  key={card.image}>
										<input
											className="lg:h-40 md:h-20 cursor-default"
											type='image'
											alt="Card Image"
											src={isSuddenDeath && !deathCards[0] || back ? backOfCard : card.image}
										/>
									</li>
								))}
							{winner === `YOU DON'T WIN!` && (
								<div className="grid place-items-center text-8xl text-red-700 animate-bounce h-screen w-screen">
									<h2>{winner}</h2>
								</div>
							)}
						</div>
						<div className="relative max-w-full h-10">
							{winner.length === 0 && player.deck.length > 0 && (
								<li className="absolute  place-items-center">
									<img className="lg:h-50 md:h-25" alt="Card Image" src={deck} />
								</li>
							)}
						</div>
						<div className="grid grid-cols-[repeat(8,minmax(0px,100px))]  justify-center lg:w-screen lg:h-80 md:h-40 mb-50 md:w-150 md:-ml-50 md:pb-2">
							{player.two.length > 0 && winner.length === 0 &&
								player.two.map((card, i) => (
									<li key={card.image}>
										<input
											className="lg:h-40 md:h-20"
											type="image"
											alt="Card Image"
											src={isSuddenDeath && !deathCards[1] || back ? backOfCard : card.image}
											onClick={() => handlePlayerTwo(card, i)}
											disabled={disable || (isSuddenDeath && deathCards.length === 0)}
										/>
									</li>
								))}
							{winner === 'YOU WIN!' && (
								<h2 className="grid place-items-center text-8xl text-green-700 h-screen animate-bounce">
									<br />{winner}
								</h2>
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
