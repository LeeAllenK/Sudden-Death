
export function Backbtn({className,onClick}){

	return (
		<div className="grid  w-full h-20 grid-rows-[auto_auto]">
			<button className={className} onClick={onClick}>Back</button>
			<p className="grid place-items-center w-screen lg:text-6xl md:text-5xl sm:text-5xl text-2xl">
				Rules of Sudden Death
			</p>
		</div>

	)
}