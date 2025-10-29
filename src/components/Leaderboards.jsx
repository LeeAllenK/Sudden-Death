

export function Leaderboard({setLeaderboards ,sortedLeaders}){
	return(
		<div className="grid items-center justify-center lg:w-screen lg:h-screen md:w-screen md:h-screen sm:w-screen w-screen grid-rows-[auto_auto_auto] gap-4">
			<button
				className="border lg:text-4xl lg:border-4 lg:w-full md:w-full sm:w-full max-w-full mt-2 lg:rounded-full lg:h-15 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse" onClick={()=> setLeaderboards(lb=>!lb)} >
				MENU
			</button>	
			<p className="grid place-items-center text-5xl text-red-700">Leaderboard</p>
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
