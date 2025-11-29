export function appReducer(state,action){
	switch(action.type){
		case "Get-DeckId":{
			console.log(action)
			return{...state, deckId: action.deckId}
		}
		case "Set-Cards":{
			return{...state, cards:action.cards}
		}
		case "Play-Game":{
			console.log('Play Game')
			if(action.btn === "Play"){
				return{...state, play: action.play}
			}else if(action.btn === "Home"){
				return{...state, play: action.play}
			}
		}
		case "Back":{	
			return{...state, instructions:action.instructions}	
		}
		case "Instructions":{
			console.log('instrucitons')
			if(action.btn === "Main"){
				return{...state, instructions:action.instructions}
			}else if(action.btn === 'Back'){
				return{...state, instructions:action.instructions}
			}
		}
		case "Leaderboard":{
			if(action.btn === "Main"){
				return{...state, leaderboards:action.leaderboards}
			}else if(action.btn === 'Back'){
				return{...state, leaderboards: action.leaderboards}
			}else if(action.leader === "Text"){
				return{...state, leaders:action.leaders}
			}
		}
		default: return state;
	}
}