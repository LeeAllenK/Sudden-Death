import { useState } from 'react';

export function Username({ saveUsername, setUsername }) {
	const [inputUsername, setInputUsername] = useState('');

	return (
		<>
			<p>{inputUsername.length === 3 ? 'Initials Added' :'Insert Initials' }</p>
			<input
				className='username'
				type='text'
				value={inputUsername}
				onChange={(e) => {
					setInputUsername(e.target.value);
					setUsername(e.target.value);
					console.log(inputUsername);
				}}
			/>
		</>
	);
}
