
import {Btn} from './Btn'

export function Instructions({setInstructions}) {
	return (
		<>
			{setInstructions && (
				<section className="grid h-screen w-screen items-center justify-center grid-rows-[auto_auto]">
					<div className="grid grid-rows-[auto_auto] text-red-700 mt-2 animate-pulse max-w-full h-fit pt-5">
						<Btn className=" lg:text-6xl md:text-5xl  border-4 max-w-[99%] w-auto rounded-full lg:h-full md:h-15 active:translate-y-1 border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#dbdada] to-[#fc0101] shadow-[0_4px_3px_#ff0101] cursor-pointer bg-black lg:text-black md:text-black hover:animate-pulse" onClick={() => setInstructions((si) => !si)} value={'Home'}/></div>
						<p className="grid place-items-center w-screen md:mt-2 lg:text-6xl md:text-5xl sm:text-5xl text-2xl">Rules of Sudden Death</p>
					<p className="grid place-items-start text-white lg:text-5xl md:text-2xl sm:text-3xl text-xl  h-screen max-w-[99%] w-auto pl-10 "><br />
						The name of the game is Sudden Death!! Each player will be dealt 6 cards to start. Once the first card from the deck is flipped, the game begins. Each player has the opportunity to choose a card from their pile, BUT BE QUICK TIME WAITS FOR NO ONE! If the card you've chosen is higher than the card the deck displays, that player wins that turn, and the loser then receives that player's card. If neither player can beat the card pulled from the deck, a 'Sudden Death Button' will activate. Once Sudden Death has been chosen, each player's deck will flip over, and each has the opportunity to choose a card from their pile. Whoever has the highest card wins, and the loser receives that card. A winner is decided once a player has an empty hand or the deck no longer has cards.
					</p>
				</section>
			)}
		</>
	);
}
