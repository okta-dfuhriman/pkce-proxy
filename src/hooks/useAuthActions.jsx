/** @format */

import { Try } from '@mui/icons-material';
import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo as getUser } from '../utils';

export const useAuthActions = () => {
	const { authState, oktaAuth } = useOktaAuth();

	const errorHandler = (dispatch, error, type = 'LOGIN_ERROR') => {
		if (dispatch) {
			dispatch({ type: type ?? 'LOGIN_ERROR', error: error });
		}
		return console.error(`${type}:`, error);
	};

	const isLoginRedirect = async dispatch => {
		try {
			const { pkce, responseType, responseMode, redirectUri } = oktaAuth,
				location = window.location,
				isRedirectUri =
					location.href && location.href.indexOf(redirectUri) === 0,
				codeFlow = pkce || responseType === 'code' || responseMode === 'query',
				hashOrSearch =
					codeFlow && responseMode !== 'fragment'
						? location.search
						: location.hash,
				hasTokensInHash = /((id|access)_token)/i.test(location.hash),
				hasCode =
					/(code=)/i.test(hashOrSearch) ||
					/(interaction_code)/i.test(hashOrSearch),
				hasErrorInUrl =
					/(error=)/i.test(hashOrSearch) ||
					/(error_description)/i.test(hashOrSearch);

			const result =
				hasTokensInHash ||
				(codeFlow && hasCode) ||
				hasErrorInUrl ||
				isRedirectUri;
			console.debug('isLoginRedirect:', result);
			return result;
		} catch (error) {
			return errorHandler(dispatch, error);
		}
	};

	const silentLogin = async dispatch => {
		try {
			let hasSession = false;
			console.debug('doing silent auth...');

			const { tokens } = await oktaAuth.token.getWithoutPrompt();

			if (!tokens) {
				throw new Error('No tokens!');
			}

			await oktaAuth.tokenManager.setTokens(tokens);

			const isAuthenticated = await oktaAuth.isAuthenticated();

			hasSession = isAuthenticated;

			return { isAuthenticated, hasSession };
		} catch (error) {
			return errorHandler(dispatch, error);
		}
	};

	const login = async (dispatch, props) => {
		try {
			const tokens = props?.tokens;

			const isRedirect = await isLoginRedirect(dispatch),
				handleRedirect = isLoginRedirect || tokens;

			let hasSession, isAuthenticated;

			if (handleRedirect) {
				console.debug('handling Okta redirect...');

				dispatch({ type: 'LOGIN_REDIRECT' });

				await oktaAuth.storeTokensFromRedirect();

				oktaAuth.removeOriginalUri();

				await oktaAuth.authStateManager.updateAuthState();

				({ hasSession, isAuthenticated } = await silentLogin(dispatch));
			} else {
				hasSession = await oktaAuth.session.exists();
				isAuthenticated = await oktaAuth.isAuthenticated();

				if (
					(isAuthenticated && !oktaAuth.getAccessToken) ||
					(!isAuthenticated && hasSession)
				) {
					({ hasSession, isAuthenticated } = await silentLogin(dispatch));
				} else {
					return dispatch({ type: 'LOGIN_INIT' });
				}
			}

			if (isAuthenticated) {
				dispatch({
					type: 'LOGIN_SUCCESS',
					payload: { iFrameIsVisible: false, authModalIsVisible: false },
				});
				return getUser(oktaAuth, dispatch);
			}
		} catch (error) {
			return errorHandler(dispatch, error);
		}
	};

	const logout = (dispatch, postLogoutRedirect) => {
		let config = {};

		if (postLogoutRedirect) {
			config = { postLogoutRedirectUri: postLogoutRedirect };
		}

		console.info('executing logout...');
		dispatch({ type: 'LOGOUT' });

		localStorage.removeItem('user');

		return oktaAuth
			.signOut(config)
			.then(() => dispatch({ type: 'LOGOUT_SUCCESS' }));
	};

	return {
		getUser,
		isLoginRedirect,
		login,
		logout,
	};
};
