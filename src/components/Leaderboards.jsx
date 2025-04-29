

export function Leaderboard({setLeaderboards ,sortedLeaders}){
	return(
		<div className="grid items-center lg:w-screen lg:h-screen md:w-screen md:h-screen grid-rows-[auto_auto_auto] gap-6">
			<button
				className="border lg:text-4xl lg:border-4 lg:screen mt-2 lg:rounded-full lg:h-15 lg:w-100 active:translate-y-2 cursor-pointer bg-black text-red-700 hover:animate-pulse">
				MENU
			</button>	
			<p className="grid place-items-center text-5xl text-red-700">Leaderboard</p>
			<ul className="grid leaderboard place-items-center gap-4">
				{sortedLeaders.map((lead, i) => (
					<li className="stats" key={lead._id}>
						{lead.text.toUpperCase()} {lead.time}
					</li>
				))}
			</ul>
		</div>

	)
}
