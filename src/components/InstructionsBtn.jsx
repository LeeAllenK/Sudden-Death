import { useState } from 'react';
// import '../instructions.css'
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
					<button className='flex justify-center items-center border lg:text-7xl lg:border-4 lg:screen lg:rounded-full lg:h-30 lg:w-200 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse' onClick={handleClick}>{value}</button>
				</>
			)}
			{showInstructions && (
				<div className='flex flex-col items-center border-3 text-red-100 border-black w-screen '>
					<button className='border lg:text-4xl lg:border-4 lg:screen mt-2 lg:rounded-full lg:h-15 lg:w-100 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse' onClick={handleRemove}>Back</button>
					<p className='text-red-700 text-4xl mt-2 animate-pulse'>Rules of Sudden Death</p>
					<p className='text-white text-3xl m-5'>
						<br/>
						The name of the game is Sudden Death!! Each player will be dealt 7 cards to start. Once the first card from the deck is flipped, the game begins. Each player has the opportunity to choose a card from their pile, BUT BE QUICK TIME WAITS FOR NO ONE! If the card you've chosen is higher than the card the deck displays, that player wins that turn, and the loser then receives that player's card. If neither player can beat the card pulled from the deck, a 'Sudden Death Button' will activate. Once Sudden Death has been chosen, each player's deck will flip over, and each has the opportunity to choose a card from their pile. Whoever has the highest card wins, and the loser receives that card. A winner is decided once a player has an empty hand or the deck no longer has cards.
					</p>
				</div>
			)}
		</>
	);
}
