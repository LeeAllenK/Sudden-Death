import { useState } from 'react';
import '../instructions.css'
export function InstructionsBtn({ value}) {
	const [showInstructions, setShowInstructions] = useState(false);

	const handleClick = () => {
		setShowInstructions(true);
	};
	const handleRemove = () =>{
		setShowInstructions(false);
	}
	return (
		<>
			{!showInstructions && (
				<>
					<button className='instructionBtn' onClick={handleClick}>{value}</button>
				</>
			)}
			{showInstructions && (
				<div className='instructions'>
					<button className='removeInstructionsBtn' onClick={handleRemove}>Back</button>
					<p>
						Rules of Sudden Death<br/><br />
						The name of the game is Sudden Death!! Each player will be dealt 7 cards to start. Once the first card from the deck is flipped, the game begins. Each player has the opportunity to choose a card from their pile, BUT BE QUICK TIME WAITS FOR NO ONE! If the card you've chosen is higher than the card the deck displays, that player wins that turn, and the loser then receives that player's card. If neither player can beat the card pulled from the deck, a 'Sudden Death Button' will activate. Once Sudden Death has been chosen, each player's deck will flip over, and each has the opportunity to choose a card from their pile. Whoever has the highest card wins, and the loser receives that card. A winner is decided once a player has an empty hand or the deck no longer has cards.
					</p>
				</div>
			)}
		</>
	);
}
