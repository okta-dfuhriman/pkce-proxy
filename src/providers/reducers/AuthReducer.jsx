/** @format */

export const initialState = {
	isLoading: false,
	isAuthenticated: false,
	authModalIsVisible: false,
	iFrameIsVisible: false,
};

export const AuthReducer = (state, action) => {
	// console.debug('======= current state =======');
	// console.debug(JSON.stringify(state, null, 2));
	// console.debug('=======    action     =======');
	// console.debug(JSON.stringify(action, null, 2));
	switch (action.type) {
		case 'GET_USER':
			return { ...state, ...action?.payload, profileIsLoading: true };
		case 'LOGIN_STARTED':
			return {
				...state,
				...action?.payload,
				iFrameIsVisible: true,
				authModalIsVisible: true,
				isLoading: false,
			};
		case 'LOGIN_INIT':
			return {
				...state,
				...action?.payload,
				iFrameIsVisible: true,
				authModalIsVisible: true,
				isLoading: true,
			};
		case 'LOGIN_REDIRECT':
			return { ...state, ...action?.payload, isLoading: true };
		case 'LOGIN_COMPLETE':
			return {
				...state,
				...action?.payload,
				isLoading: true,
				iFrameIsVisible: false,
				authModalIsVisible: false,
			};
		case 'LOGIN_SUCCESS':
		case 'GET_USER_SUCCESS':
		case 'SUCCESS':
			return {
				...state,
				...action?.payload,
				isLoading: false,
			};
		case 'LOGIN_CANCEL':
			return {
				...state,
				...action?.payload,
				isLoading: false,
				authModalIsVisible: false,
			};
		case 'LOGOUT_SUCCESS':
			return { ...state, ...action?.payload, isLoading: false };
		case 'LOGOUT':
			return { ...state, ...action?.payload, isLoading: true };
		case 'ERROR':
		case 'FETCH_ERROR':
		case 'LOGIN_ERROR':
			return { ...state, errorMessage: action?.error };
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};
