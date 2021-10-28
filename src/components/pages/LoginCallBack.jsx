/** @format */
import { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Loader } from '../../components';
import { useAuthState, useAuthDispatch } from '../../providers';

const ORIGIN = process.env.REACT_APP_OKTA_ORIGIN;

export const LoginCallback = () => {
	const { login } = useAuthState();
	const dispatch = useAuthDispatch();

	useEffect(() => {
		return login(dispatch).then(() => {
			dispatch({ type: 'LOGIN_COMPLETE' });
			window.top.postMessage(
				{
					error: false,
					type: 'callback',
					result: 'success',
				},
				ORIGIN
			);
		});
	}, []);

	return (
		<div>
			<Loader />
		</div>
	);
};
