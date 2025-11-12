
export function gameReducer(state,action){
	switch(action.type){
		case 'SuddenDeath':{
			return{ isSuddenDeath: action.isSuddenDeath }
		}
		case 'SuddenDeath-Round':{
			console.log('start round');
			return{	isSuddenDeath: action.isSuddenDeath}
		}
		case 'Resume-Round':{
			return{ stop: action.stop }
		}
		case 'Flip-Card':{
			return{ disable:false }
		}
		case 'Reshuffle':{
			console.log('shuffle');
			return{ isSuddenDeath: false, stop:false }
		}
	}
}