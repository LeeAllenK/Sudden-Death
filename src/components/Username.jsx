import { useState } from 'react';

export function Username({setUsername }) {
	const [inputUsername, setInputUsername] = useState('');
	return (
		<>
			<p className="text-white text-7xl">{inputUsername.length === 3 ? 'Initials Added' :'Insert Initials' }</p>
			<input
				className='border-3 border-white text-white'
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
