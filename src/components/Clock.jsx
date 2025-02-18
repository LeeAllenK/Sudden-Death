import {useState,useEffect} from 'react'
import {Username} from './Username'

export function Clock({winner}){
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [username, setUsername] = useState('');
	
	useEffect(()=>{
		const timer = setInterval(()=>{
			setSeconds(seconds +1)
			if(seconds > 58){
				setSeconds(0);
				setMinutes(minutes+1)
			}
		},1000)
			if(minutes === 99 && seconds === 59){
				clearInterval(timer);
			}
		if(winner.length > 0){
			clearInterval(timer);
		}
		return () => clearInterval(timer);
	},[seconds])
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
				const data = await res.json();
				console.log(data)
			}catch(err){
				console.error(err)
			}
		}
		useEffect(() =>{
			if(winner.includes('YOU WIN!') && (minutes > 0 || seconds > 0) && username.length === 3){
				saveTime(username,minutes,seconds)
			}
				console.log('WINNER',winner)
		},[winner,username])
	return(
		<div>
			{winner.includes('YOU WIN!') && username.length < 3 &&
			<Username setUsername={setUsername} />
			}
			
		<h3 className='clock' value={winner}>{minutes < 10 ? '0'+minutes: minutes} : {seconds < 10 ? '0'+ seconds : seconds}</h3>
		</div>
	)
}