
export function Btn({ setPlay, onClick, onBackClick, setLeaderboards ,value}){
	return(
		<button setPlay={setPlay} onClick={onClick}  >{value}</button>
	)
}	