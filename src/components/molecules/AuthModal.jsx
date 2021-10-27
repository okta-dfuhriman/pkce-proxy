/** @format */

import { useEffect } from 'react';
import { IconButton, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import swal from 'sweetalert';
import { AuthDialog, Loader } from '../../components';
import { useAuthDispatch, useAuthState } from '../../providers';

export const AuthModal = props => {
	const { onClose } = props;
	const dispatch = useAuthDispatch();
	const { authModalIsVisible, isLoading, iFrameIsVisible, user } =
		useAuthState();

	const URL = process.env.REACT_APP_STEP_UP_URL,
		src = user?.email ? `${URL}?login_hint=${user.email}` : URL,
		ALLOW = process.env.REACT_APP_STEP_UP_ALLOW,
		modalWidth = '400px',
		modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'LOGIN_CANCEL' });
		return onClose();
	};
	useEffect(() => {
		const handler = ({ origin, data }) => {
      let options = {};
      
			switch (data?.type) {
				case 'onload':
					if (data?.result === 'success') {
						return dispatch({ type: 'LOGIN_STARTED' });
					}
					break; 
				case 'callback':
					if (origin !== window.location.origin) {
						return;
					}
					if (data?.result === 'success') {
						dispatch({
							type: 'LOGIN_SUCCESS',
							payload: { authModalIsVisible: false },
						});
					} else {
						dispatch({
							type: 'LOGIN_ERROR',
							payload: { authModalIsVisible: false },
						});

						options = {
							...options,
							title: 'Uh oh!',
							text: 'Something went wrong. We are so sorry!',
							button: 'Drats',
							icon: 'error',
						};
            return swal(options);
					}
          break;
				default:
					break;
			}
		};

		window.addEventListener('message', handler);

		return () => window.removeEventListener('message', handler);
	}, []);

	return (
		<AuthDialog open={authModalIsVisible} onClose={onClose}>
			<DialogTitle>
				<IconButton
					edge='end'
					size='small'
					onClick={onCancel}
					sx={{
						color: 'white',
						position: 'absolute',
						borderRadius: 25,
						background: 'rgba(0, 0, 0, 0.53)',
						right: -15,
						top: -15,
						'z-index': '10',
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ width: modalWidth, height: modalHeight }}>
				{isLoading && <Loader />}
				{src && iFrameIsVisible && (
					<iframe
						src={src}
						name='iframe-auth'
						title='Login'
						width={modalWidth}
						height={modalHeight}
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						allow={ALLOW}
					/>
				)}
			</DialogContent>
		</AuthDialog>
	);
};
