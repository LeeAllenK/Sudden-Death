import { useState } from 'react';

export function Username({setUsername }) {
	const [inputUsername, setInputUsername] = useState('');
	return (
		<>
			<p className="text-white lg:text-6xl md:text-4xl sm:text-2xl text-xl">{inputUsername.length === 3 ? 'Initials Added' :'Initials' }</p>
			<input
				className='border-3 text-sm w-full border-white text-white'
				type='text'
				value={inputUsername}
				onChange={(e) => {
					setInputUsername(e.target.value);
					setUsername(e.target.value);
				}}
			/>
		</>
	);
}
