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
					<button className='flex justify-center items-center lg:text-7xl md:text-6xl sm:text-5xl border-4 lg:rounded-full lg:h-30 md:h-20 sm:h-20 lg:w-200 md:w-screen sm:w-screen active:translate-y-2 md:mb-3 sm:mb-3 cursor-pointer border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#717070] to-[#f7acac] shadow-[0_4px_3px_#ff0101] bg-black text-red-700 hover:animate-pulse' onClick={handleClick}>{value}</button>
				</>
			)}
			{showInstructions && (
				<div className='flex flex-col items-center  border-3 text-red-100 border-black w-screen p-1 '>
					<button className=' lg:text-4xl md:text-3xl border-4 md:m-0 mt-5 lg:rounded-full lg:h-15 md:h-10  md:rounded-full lg:w-100 md:w-100 sm:w-screen w-100 active:translate-y-1  border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#dbdada] to-[#fc0101] shadow-[0_4px_3px_#ff0101] cursor-pointer bg-black lg:text-red-700 md:text-black  hover:animate-pulse' onClick={handleRemove}>Back</button>
					<p className='text-red-700 lg:text-4xl md:text-2xl sm:text-5xl text-2xl mt-2  animate-pulse'>Rules of Sudden Death</p>
					<p className='text-white  lg:text-3xl md:text-xl sm:text-3xl text-xl lg:m-5 md:m-1 sm:m-5 m-1 '>
						<br/>
						The name of the game is Sudden Death!! Each player will be dealt 7 cards to start. Once the first card from the deck is flipped, the game begins. Each player has the opportunity to choose a card from their pile, BUT BE QUICK TIME WAITS FOR NO ONE! If the card you've chosen is higher than the card the deck displays, that player wins that turn, and the loser then receives that player's card. If neither player can beat the card pulled from the deck, a 'Sudden Death Button' will activate. Once Sudden Death has been chosen, each player's deck will flip over, and each has the opportunity to choose a card from their pile. Whoever has the highest card wins, and the loser receives that card. A winner is decided once a player has an empty hand or the deck no longer has cards.
					</p>
				</div>
			)}
		</>
	);
}
