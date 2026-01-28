import { useState, useEffect, useRef } from 'react';
import { Username } from './Username';
import { HomeBtn } from './Home-Btn';

export function Clock({ winner }) {
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [username, setUsername] = useState('');
	const timerRef = useRef(null);

	// Start interval 
	useEffect(() => {
		if(winner.length > 0) return; 
		timerRef.current = setInterval(() => {
			setSeconds(seconds => seconds+1)
			if(seconds === 59){
				setSeconds(0);
				setMinutes(minute=> minute + 1)
			}
		}, 1000);

		return () => clearInterval(timerRef.current);
	}, [winner,seconds,minutes]);

	useEffect(() => {
		if((minutes === 10 && seconds === 0) || winner.length > 0) {
			clearInterval(timerRef.current);
			timerRef.current = null; 
		}
	}, [minutes, seconds, winner]);

	const saveTime = async (username, minutes, seconds) => {
		const time = `${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds
			}`;
		const newTime = { time, text: username };

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/username`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTime),
			});
			if(!res.ok) throw new Error('Network response was not ok');
			const data = await res.json();
			console.log(data);
		} catch(err) {
			console.error(err);
			alert('Error has occurred');
		}
	};

	useEffect(() => {
		if(
			winner.includes('YOU WIN!') &&
			(minutes > 0 || seconds > 0) &&
			username.length === 3
		) {
			saveTime(username, minutes, seconds);
		}
	}, [winner, username, minutes, seconds]);

	return (
		<section className="grid justify-center items-end grid-rows-[auto_auto] w-full h-full">
			<h3 className="grid justify-center text-white lg:text-5xl md:text-5xl sm:text-5xl text-2xl w-full place-items-center">
				{winner ? (
					<>
						{winner.includes('YOU WIN!') && username.length < 3 && (<Username setUsername={setUsername} />)}
					</>
				) : (
					<>
						{minutes < 10 ? '0' + minutes : minutes} : {' '}
						{seconds < 10 ? '0' + seconds : seconds}
					</>
				)}
			</h3>
		</section>
	);
}
