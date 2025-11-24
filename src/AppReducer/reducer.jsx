
export function gameReducer(state,action){
	switch(action.type){
		case "ShowPlayers":{
			console.log('show');
			return{...state, enableSuddenDeathPlayer:false}
		}
		case "Flipcard-Face":{
			// console.log('FlipFace');
			return{...state, disable: false}
		}
		case "PlayerTwo-Comp-Card":{
			// console.log('Normal-Comp');
			return{...state, disable: true}
		}
		case "PlayerTwo-SD-Comp-Card":{
			return{...state, disable:false}
		}	
		case "SD-Player":{
			return{...state,enableSuddenDeathPlayer:action.enableSuddenDeathPlayer}
		}
		case "Enable-SuddenDeathPlayer":{
				// console.log('enableSD')
			return{...state,enableSuddenDeathPlayer:true, disable: false}
		}
		case "Start-SD-Round":{
			return{...state, isSuddenDeath: true}
		}
		case "Compare-DeathCards":{
			return{...state, disable: true}
		}
		case "Comp-Deathcards-Win":{
			// console.log('comp-death-Win')
			return{...state, isSuddenDeath:action.isSuddenDeath}
		}
		case "Comp-Deathcards-End":{
			// console.log('comp-death-Win')
			return{...state, enableSuddenDeathPlayer:false}
		}
		case "Reshuffle-Cards":{
			// console.log('Reshuffle');
			return{...state, isSuddenDeath: false, enableSuddenDeathPlayer:false, disable: false, winner: action.winner}
		}
		case "Winner":{
			return{...state, disable: true, winner: action.winner}
		}
		case "Winner-PlayerOneTurn":{
			return{...state, winner: action.winner}
		}
		default: return state;
	}
}