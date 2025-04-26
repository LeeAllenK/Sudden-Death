export function HomeBtn({onClick}){

	return(
  	<div className='flex justify-start lg:w-screen ' >         
		<button
			className='flex justify-center items-center lg:w-60 lg:h-10  rounded-full ml-10 cursor-pointer bg-black text-black font-bold lg:text-4xl border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[rgb(230,86,86)] to-[#ff0000] shadow-[0_4px_3px_#ff0000] hover:animate-pulse '
			onClick={onClick}
		>
			Home
		</button>
     </div>
	)
}