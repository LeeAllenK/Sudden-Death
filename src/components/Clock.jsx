import {useState,useEffect} from 'react'
import {Username} from './Username'
import {HomeBtn} from './Home-Btn'
export function Clock({winner}){
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [username, setUsername] = useState('');
	const [play, setPlay] = useState(false)
	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prevSeconds) => {
				if(prevSeconds > 58) {
					setMinutes((prevMinutes) => prevMinutes + 1);
					return 0;
				}
				return prevSeconds + 1;
			});
		}, 1000);

		if(minutes === 99 && seconds === 59) {
			clearInterval(timer);
		}
		if(winner.length > 0) {
			clearInterval(timer);
		}
		return () => clearInterval(timer);
	}, [seconds, minutes, winner]);

		const saveTime = async (username, minutes,seconds)=>{
			const time = `${minutes < 10 ? '0' + minutes : minutes } : ${ seconds < 10 ? '0' + seconds : seconds }`
			const newTime = {time, text:username}

			try{
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/username`,{
					method: 'POST',	
					headers:{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(newTime)
				})
				if(!res.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await res.json();
				console.log(data)
			}catch(err){
				console.error(err)
				alert('Error has occured')
			}
		}
		useEffect(() =>{
			if(winner.includes('YOU WIN!') && (minutes > 0 || seconds > 0) && username.length === 3){
				saveTime(username,minutes,seconds)
			}
				console.log('WINNER',winner)
		},[winner,username,minutes,seconds])
	return(
		<div className="grid justify-end grid-rows-[auto_auto] w-full gap-4">
			{winner.includes("YOU WIN!") && username.length < 3 && <Username setUsername={setUsername} />}
			<h3 className="grid md:justify-end text-white lg:text-4xl md:text-2xl w-full place-items-end" value={winner}>
				{minutes < 10 ? "0" + minutes : minutes} : {seconds < 10 ? "0" + seconds : seconds}
			</h3>
		</div>

	)
}