/** @format */

import * as _ from 'lodash';

export const initialState = {
	isLoading: false,
	isLoadingLogin: false,
	isAuthenticated: false,
	isLoadingProfile: false,
};

export const AuthReducer = (state, action) => {
	// console.debug('======= current state =======');
	// console.debug(JSON.stringify(state, null, 2));
	// console.debug('=======    action     =======');
	// console.debug(JSON.stringify(action, null, 2));
	switch (action.type) {
		case 'GET_USER':
			return _.merge({}, state, { isLoadingProfile: true });
		case 'LOGIN_AUTHORIZE':
		case 'LOGIN_STARTED':
			return _.merge({}, state, action?.payload, {
				iFrameIsVisible: true,
				authModalIsVisible: true,
				isLoadingLogin: false,
			});
		case 'LOGIN_START':
			return _.merge({}, state, action?.payload, { isLoadingLogin: true });
		case 'LOGIN_MODAL_START':
			return _.merge({}, state, action?.payload, {
				iFrameIsVisible: true,
				authModalIsVisible: true,
				isLoadingLogin: true,
			});
		case 'LOGIN_REDIRECT':
			return _.merge({}, state, action?.payload, { isLoadingLogin: true });
		case 'EXCHANGE_CODE':
		case 'LOGIN_COMPLETE':
			return _.merge({}, state, action?.payload, {
				isLoadingLogin: true,
				iFrameIsVisible: false,
				authModalIsVisible: false,
			});

		case 'GET_USER_SUCCESS':
		case 'LOGIN_SUCCESS':
			delete state.tokenParams;
			return _.merge({}, state, { isStale: true }, action?.payload, {
				isLoadingLogin: false,
			});
		case 'SUCCESS':
			return _.merge({}, state, action?.payload, {
				isLoading: false,
			});
		case 'LOGIN_CANCEL':
			return _.merge({}, state, action?.payload, {
				isLoadingLogin: false,
				authModalIsVisible: false,
				iFrameIsVisible: false,
			});

		case 'LOGOUT_SUCCESS':
			return _.merge({}, state, action?.payload, { isLoadingLogout: false });
		case 'LOGOUT':
			return _.merge({}, state, action?.payload, { isLoadingLogout: true });
		case 'FETCH_ERROR':
		case 'LOGIN_ERROR':
			let result = _.merge({}, state, action?.payload, {
				errorMessage: action?.error,
			});
			if (action?.error) {
				console.error(action.error);
			}
			return result;
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};
