export function Menu({setPlay ,setInstructions ,setLeaderboards}){

	return(
		<div className="grid lg:items-center md:items-center lg:justify-evenly md:justify-center sm:justify-center items-center justify-start h-screen p-1 grid-rows-[auto_auto_auto] gap-4">
			<h1 className="grid justify-center lg:text-8xl md:text-7xl sm:text-7xl text-6xl font-bold text-red-700 cursor-pointer animate-pulse mb-4 md:mt-1 md:p-1">
				SUDDEN DEATH!
			</h1>
			<button
				className="grid place-items-center lg:text-7xl md:text-5xl sm:text-5xl text-4xl border-4 lg:rounded-full lg:h-30 md:h-30 sm:h-20 h-20 lg:w-200 md:w-screen sm:w-screen w-screen active:translate-y-2 md:mb-3 sm:mb-3 mb-4 cursor-pointer border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#717070] to-[#f7acac] shadow-[0_4px_3px_#ff0101] bg-black text-red-700 hover:animate-pulse leading-tight"
				onClick={() => setPlay((p) => !p)}
			>
				Play
			</button>
			<button
				className="grid place-items-center lg:text-7xl md:text-6xl sm:text-5xl text-4xl border-4 lg:rounded-full lg:h-30 md:h-30 sm:h-20 h-20 lg:w-200 md:w-screen sm:w-screen w-screen active:translate-y-2 sm:mb-3 mb-4 cursor-pointer border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#717070] to-[#f7acac] shadow-[0_4px_3px_#ff0101] bg-black text-red-700 hover:animate-pulse leading-tight"
				onClick={() => setLeaderboards((lb) => !lb)}
			>
				Leaderboard
			</button>
			<button
				className="grid place-items-center lg:text-7xl md:text-6xl sm:text-5xl text-4xl border-4 lg:rounded-full lg:h-30 md:h-30 sm:h-20 h-20 lg:w-200 md:w-screen sm:w-screen w-screen active:translate-y-2 sm:mb-3 mb-4 cursor-pointer border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#717070] to-[#f7acac] shadow-[0_4px_3px_#ff0101] bg-black text-red-700 hover:animate-pulse leading-tight"
				onClick={() => setInstructions((lb) => !lb)}
			>
				Instructions
			</button>
		</div>

	)
}