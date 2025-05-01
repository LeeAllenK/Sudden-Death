export function HomeBtn({onClick}){

	return(
		<div className="grid grid-cols-[auto] justify-center items-start w-full  ">
			<button
				className="grid place-items-center lg:w-60 md:w-50 sm:w-50 w-22  lg:h-10 md:h-8 sm:h-10 h-6 rounded-full cursor-pointer bg-black text-black font-bold lg:text-4xl md:text-3xl sm:text-3xl border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(230,86,86)] to-[#ff0000] shadow-[0_4px_3px_#ff0000] hover:animate-pulse"
				onClick={onClick}
			>
				Home
			</button>
		</div>

	)
}