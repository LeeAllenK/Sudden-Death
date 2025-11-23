
export function gameReducer(state,action){
	switch(action.type){
		case 'Showplayers':{
			
			return{...state,back:true}
		}
		case 'PlayerTwo-SD':{
			console.log('NotSDDSDFADA')
			return { ...state, stop:true, disable:false}
		}
		case 'PlayerTwo-EnableSuddenDeathPlayer':{
			return { ...state, enableSuddenDeathPlayer:true}
		}	
		case 'PlayerTwo-!SD':{
			return { ...state, disable:true}
		}	
		case 'P1-P2-vs-Deck':{
			return { ...state, enableSuddenDeathPlayer:true,disable:false}
		}
		case 'SuddenDeath':{
			console.log('sudden')
			return { ...state, isSuddenDeath: action.isSuddenDeath }
		}
		case 'SuddenDeath-Comp':{
			console.log('sudden')
			return { ...state, isSuddenDeath: action.isSuddenDeath}
		}
		case 'Resume-Round':{
			return { ...state, enableSuddenDeathPlayer:false, stop: true }
		}
		case 'SuddenDeath-Round':{
			console.log('start round');
			return { ...state,	isSuddenDeath: action.isSuddenDeath}
		}
		case 'Flip-Front':{
			return { ...state, disable:false }
		}
		case 'Flip-Back':{
			return { ...state, back: false}
		}
		case 'Flip-Back-SD':{
			return { ...state, enableSuddenDeathPlayer:false}
		}
		case 'Reshuffle':{
			
			return { ...state, enableSuddenDeathPlayer: false, isSuddenDeath: false,disable:false, stop:false, back:false }
		}
		case 'Stop':{
			return { ...state, stop: false}
		}
		case 'Enable-Card':{
			console.log(state.disable,'DISABLE')
			return{...state, disable: true}
		}
		default: return state;
	}
}