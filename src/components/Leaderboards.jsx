

export function Leaderboard({setLeaderboards ,sortedLeaders}){
	return(
		<div className="grid items-center justify-center lg:w-screen lg:h-screen md:w-screen md:h-screen sm:w-screen w-screen grid-rows-2 gap-4">
		<section>
			<button
					className="border lg:text-4xl font-extrabold lg:border-4 lg:w-screen md:w-screen sm:w-screen min-w-screen mt-2  lg:h-15 cursor-pointer bg-black text-black active:translate-y-1 border-t-[0.09em] border-b-[0.09em] border-t-[#f0f0f0] border-b-[#a8a6a6] border-none bg-linear-to-b from-[#dbdada] to-[#fc0101] shadow-[0_4px_3px_#ff0101] hover:animate-pulse" onClick={()=> setLeaderboards(lb=>!lb)} >
				MENU
			</button>	
			<p className="grid place-items-center text-5xl text-red-700">Leaderboard</p>
		</section>
			<ul className="grid leaderboard place-items-center gap-4">
				{sortedLeaders.map((lead, i) => (
					<li className="text-4xl text-white" key={lead._id}>
						{lead.text.toUpperCase()} {lead.time}
							
					</li>
				))}
			</ul>
		</div>

	)
}
