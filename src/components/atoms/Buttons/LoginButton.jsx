/** @format */

import { Button } from '../../../components';
import { useAuthDispatch } from '../../../providers';

export const LoginButton = props => {
	const dispatch = useAuthDispatch();
	// const { login } = useAuthActions();

	props = {
		// onClick: () => login(dispatch, { ...props }),
		onClick: () => dispatch({ type: 'LOGIN_INIT' }),
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
