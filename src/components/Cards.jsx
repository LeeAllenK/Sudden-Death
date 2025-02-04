import { useState, useEffect } from 'react';

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
export function Cards({ cards }) {

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
	useEffect(() => {
		const showPlayers = () => {
			const playerOne = cards.slice(0, 7);
			const playerTwo = cards.slice(7, 14 );
			const deck = cards.slice(14, cards.length);
			setPlayer({ one: playerOne, two: playerTwo, deck: deck });
		};;
		showPlayers();
	}, [cards]);

	useEffect(() => {
		const flipCard = () => {
			if(player.deck.length > 0) {
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
	}, [player.two, player.deck, stop, isSuddenDeath, disable]);

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
				if(player.one.length > 0 && !isSuddenDeath) {
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
			if(isSuddenDeath && deathCards.length < 1 && !stop) {
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
		}, 2500);
		if(player.deck.length > 0 && !isSuddenDeath) {
			if(player.one.length === 0 && player.deck.length >= 0) {
				setWinner('COMPUTER WINS!');
				setDisable(true)
				console.log('COMPUTER WON');
			}
			if(player.two.length === 0 && player.deck.length >= 0) {
				setWinner('YOU WIN!');
				clearTimeout(playerOneTurn)
				console.log('PLAYER WON');
			}
		}
		if(player.deck.length === 0 && !isSuddenDeath) {
			console.log('zero')
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
	}, [player.one, player.two, player.deck, stop, isSuddenDeath, enableSuddenDeathPlayer, winner]);
	useEffect(() => {
		if(deathCards.length === 2 && isSuddenDeath && stop) {
			compareDeathCards();
			setDisable(true)
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
			setEnableSuddenDeathPlayer(false);
			setStop(false)
			console.log('Computer Wins');
		} else if((valueOne + valueOneSuit) < (valueTwo + valueTwoSuit)) {
			setPlayer((prev) => ({
				...prev,
				one: [...prev.one, ...deathCards],
				deck: prev.deck.slice(1)
			}));
			setDeathCards(deathCards.slice(2));
			setIsSuddenDeath(!isSuddenDeath);
			setEnableSuddenDeathPlayer(false);
			setStop(false);
		}
	};
	const suddenDeath = () => {
		setIsSuddenDeath(!isSuddenDeath);
	};
	return (
		<>
			<ul className='cardsBorder'>
				{deathCards.map((card, i) => (
					<img key={i} src={card.image} alt='Death Card' style={{ height: '100px' }} />
				))}
				<button className='suddenDeathBtn'onClick={suddenDeath} disabled={!enableSuddenDeathPlayer }>SUDDEN DEATH</button>
				{player.one && player.two ? (
					<>
						<div className='pOneBox'>
							{player.one.length > 0 &&
								player.one.map((card, i) => (
									<li className='playerOneCards' key={i}>
										<img
											alt='Card Image'
											src={isSuddenDeath && !deathCards[0] ? backOfCard : card.image}
										/>
									</li>
								))
							}
							{winner === 'COMPUTER WINS!'&& (
								<div className='computerWon'><h2>{winner}</h2></div>
							)}
						</div>
						<li className='deck'>
							{player.deck.length > 0 &&
								<img
									className='deckCard'
									alt='Card Image'
									src={deck}
								/>
							}
						</li>
						<div className='pTwoBox'>
							{player.two.length > 0 &&
								player.two.map((card, i) => (
									<li className='playerTwoCards' key={i}>
										<input
											type='image'
											alt='Card Image'
											src={isSuddenDeath && !deathCards[1] ? backOfCard : card.image}
											onClick={() => handlePlayerTwo(card, i)}
											disabled={
												disable ||
												player.deck.length === 0 ||
												player.one.length === 0 ||
												(isSuddenDeath && !deathCards[0])
											}
										/>
									</li>
								))
							}
							{winner === 'YOU WIN!' && (
								<h2 className='playerWon'><br/>{winner}</h2>
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
