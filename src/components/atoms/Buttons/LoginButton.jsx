/** @format */

import { Button } from '../../../components';
import { useAuthActions, useAuthDispatch } from '../../../providers';

export const LoginButton = props => {
	const dispatch = useAuthDispatch();
	// const { login } = useAuthActions();

	props = {
		// onClick: () => login(dispatch, { ...props }),
		onClick: () => dispatch({ type: 'LOGIN_MODAL_START' }),
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
