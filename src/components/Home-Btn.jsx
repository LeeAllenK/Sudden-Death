export function HomeBtn({onClick}){
	return(
		<div className="grid grid-cols-[auto] justify-center items-start w-full  ">
			<button
				className="grid place-items-center lg:w-60 md:w-50 sm:w-50 w-25 lg:h-10 md:h-8 sm:h-10 h-4 rounded-full cursor-pointer bg-black text-black font-extrabold lg:text-4xl md:text-3xl sm:text-3xl text-sm border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(203,26,26)] to-[#682f2f] shadow-[0_4px_3px_#ff0000] active:translate-y-1 place-self-center leading-tight"
				onClick={onClick}
			>
				Home
			</button>
		</div>

	)
}