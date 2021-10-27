/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo as getUser } from '../utils';

export const useAuthActions = () => {
	const { authState, oktaAuth } = useOktaAuth();

	const login = async (dispatch, props) => {
		try {
			const tokens = props?.tokens;

			if (oktaAuth.isLoginRedirect() || tokens) {
				console.debug('handling Okta redirect...');

				dispatch({ type: 'LOGIN_REDIRECT' });

        await oktaAuth.storeTokensFromRedirect();

        oktaAuth.removeOriginalUri();

        await oktaAuth.authStateManager.updateAuthState();

        return;
				} else {
					console.debug('handling redirect...');

					if (tokens) {
						console.debug('tokens:', tokens);
					}

					await oktaAuth.handleLoginRedirect(tokens);

					return getUser(oktaAuth, dispatch);
				}
			} else if (!authState?.isAuthenticated) {
				console.debug('setting original uri...');

				oktaAuth.setOriginalUri(window.location.href);

				console.debug('checking for existing Okta session...');

				const hasSession = await oktaAuth.session.exists();

				console.debug('session:', hasSession);

				if (!hasSession) {
					const loginHint = props?.loginhint;

					console.debug('loginHint:', loginHint);

					console.debug('doing signInWithRedirect...');

					dispatch({ type: 'LOGIN' });

					// return oktaAuth.token.getWithPopup();
					return oktaAuth.signInWithRedirect({
						loginHint: loginHint,
					});
				} else {
					const { tokens } = await oktaAuth.token.getWithoutPrompt();

					if (tokens) {
						await oktaAuth.tokenManager.setTokens(tokens);
					}
				}
				return getUser(oktaAuth, dispatch);
			}
		} catch (err) {
			if (dispatch) {
				dispatch({ type: 'LOGIN_ERROR', error: err });
			}
			return console.error('login error:', err);
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
		login,
		logout,
	};
};
