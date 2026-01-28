
export function gameReducer(state,action){
	switch(action.type){
		case "Assign-Cards":{
			console.log('Assgncard', state.player)
			return { ...state, back: true,player: action.player }
		}
		case "ShowPlayers":{
			console.log('show');
			return{...state, enableSuddenDeathPlayer:false}
		}
		case "Player-Move":{
			return {...state,player: action.player, disable: action.disable,stop: action.stop,
			};
		}
		case "Flipcard-Face":{
			// console.log('FlipFace');
			return{...state,backImage:action.backImage, disable: false}
		}
		case "Flipcard-Back":{
			// console.log('FlipFace');
			return{...state, back: false}
		}
		case "Flip-Card":{
			console.log('FlipFace');
			return{...state, stop:false}
		}
		case "SD-Card-PlayerOne":{
			console.log('PLAYERONE SUDDEN CARD')
			return{...state, player:{...state.player,...action.player}}
		}
		case "PlayerOne-Deathcard":{
			return{...state, deathCards:action.deathCards}
		}
		case "PlayerTwo-Comp-Card":{
			console.log('Normal-Comp');
			return{...state, disable: true,player:{ ...state.player,...action.player}}
		}
		case "PlayerTwo-SD-Comp-Card":{
			return{...state,player:{...state.player,...action.player}, deathCards:action.deathCards, disable: false, stop: true}
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
		case "Winner-DC": {
			if(action.winner === "Player-One") {
				console.log('PLAYER111111111111111111 WINS')
				return {
					...state,
					player: {
						...state.player,
						one: state.player.one.filter(c => !action.deathCards.includes(c)),
						two: [...state.player.two, ...action.deathCards],
						deck: action.deck
					},
					deathCards: []
				};
			} else if(action.winner === "Player-Two") {
				console.log('PLAYER22222222222222 WINS')
				return {
					...state,
					player: {
						...state.player,
						one: [...state.player.one, ...action.deathCards],
						two: state.player.two.filter(c => !action.deathCards.includes(c)),
						deck: action.deck
					},
					deathCards: []
				};
			}
			return state;
		}
		case "Comp-Deathcards-Win":{
			// console.log('comp-death-Win')
			return{...state, isSuddenDeath:action.isSuddenDeath}
		}
		case "Comp-Deathcards-End":{
			// console.log('comp-death-Win')
			return{...state, enableSuddenDeathPlayer:false, stop:false}
		}
		case "Reshuffle-Cards":{
			// console.log('Reshuffle');
			return{...state, player:action.player, isSuddenDeath: false, enableSuddenDeathPlayer:false,backImage:action.backImage, stop: false, disable: false, winner: action.winner,deathCards:[]}
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