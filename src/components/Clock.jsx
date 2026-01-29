import { useState, useEffect, useRef } from 'react';
import { Username } from './Username';

export function Clock({ winner, reset }) {
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [username, setUsername] = useState('');
	const timerRef = useRef(null);
	useEffect(() => {

		if(winner.length > 0 || reset) {
			clearInterval(timerRef.current);
			setSeconds(0);
			setMinutes(0);
			return;
		}
	//useRef used to keep track of timer
		timerRef.current = setInterval(() => {
			setSeconds(second => {
				if(second === 59) {
					setMinutes(m => m + 1);
					return 0;
				}
				return second + 1;
			});
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, [winner, reset]);

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
		} catch(err) {
			return err;
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
