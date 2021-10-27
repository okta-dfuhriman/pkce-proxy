/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo as getUser } from '../utils';

const ORG_URL = process.env.REACT_APP_OKTA_ORG_URL;

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
				// } else {
				// 	console.debug('handling redirect...');

				// 	if (tokens) {
				// 		console.debug('tokens:', tokens);
				// 	}

				// 	await oktaAuth.handleLoginRedirect(tokens);

				// 	return getUser(oktaAuth, dispatch);
			} else if (!authState?.isAuthenticated) {
				console.debug('setting original uri...');

				oktaAuth.setOriginalUri(window.location.href);

				console.debug('checking for existing Okta session...');

				const hasSession = await oktaAuth.session.exists();

				console.debug('session:', hasSession);

				if (!hasSession) {
					const loginHint = props?.loginhint;

					console.debug('loginHint:', loginHint);

					console.debug('generating URL...');

					dispatch({ type: 'LOGIN_START' });

					const {
						responseType,
						redirectUri,
						state,
						nonce,
						scopes,
						codeChallengeMethod,
						codeChallenge,
						clientId,
					} = await oktaAuth.token.prepareTokenParams();
					const { issuer } = await oktaAuth.options;
					// console.debug(JSON.stringify(params, null, 2));
					// console.debug(JSON.stringify(config, null, 2));

					let authUrl = new URL(`${issuer}/authorize`);

					authUrl.searchParams.append('client_id', clientId);
					authUrl.searchParams.append('response_type', responseType);
					authUrl.searchParams.append('scope', scopes);
					authUrl.searchParams.append('redirect_uri', redirectUri);
					authUrl.searchParams.append('state', state);
					authUrl.searchParams.append('nonce', nonce);
					authUrl.searchParams.append(
						'code_challenge_method',
						codeChallengeMethod
					);
					authUrl.searchParams.append('code_challenge', codeChallenge);
					authUrl.searchParams.append('response_mode', 'okta_post_message');

					return dispatch({
						type: 'LOGIN_AUTHORIZE',
						payload: { authUrl: authUrl.toString() },
					});

					// return oktaAuth.token.getWithPopup();
					// return oktaAuth.signInWithRedirect({
					// 	loginHint: loginHint,
					// });
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
