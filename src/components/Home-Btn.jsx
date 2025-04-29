export function HomeBtn({onClick}){

	return(
		<div className="grid justify-start w-full grid-cols-[auto]">
			<button
				className="grid place-items-center lg:w-60 md:w-60 lg:h-8 md:h-6 rounded-full ml-10 md:m-0 cursor-pointer bg-black text-black font-bold lg:text-4xl md:text-3xl border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(230,86,86)] to-[#ff0000] shadow-[0_4px_3px_#ff0000] hover:animate-pulse"
				onClick={onClick}
			>
				Home
			</button>
		</div>

	)
}