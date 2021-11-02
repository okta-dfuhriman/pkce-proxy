/** @format */

import { useEffect } from 'react';
import { IconButton, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import swal from 'sweetalert';
import { AuthDialog, Loader } from '../../components';
import { useAuthActions, useAuthDispatch, useAuthState } from '../../providers';

const ENV = process.env.NODE_ENV;

export const AuthModal = props => {
	const { onClose } = props;
	const dispatch = useAuthDispatch();
	const { login } = useAuthActions();
	const {
		authModalIsVisible,
		isLoadingLogin,
		iFrameIsVisible,
		user,
		authUrl,
		tokenParams,
	} = useAuthState();

	const URL = process.env.REACT_APP_STEP_UP_URL,
		ALLOW = process.env.REACT_APP_STEP_UP_ALLOW,
		modalWidth = '400px',
		modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'LOGIN_CANCEL' });
		return onClose();
	};

	useEffect(() => {
		console.log('authModalIsVisible:', authModalIsVisible);
		if (authModalIsVisible) {
			login(dispatch);
		}
	}, [authModalIsVisible]);
	useEffect(() => {
		if (tokenParams?.authorizationCode) {
			return login(dispatch, {
				tokenParams,
			});
		}
	}, [tokenParams]);
	useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			if (ENV === 'production') {
				if (origin !== window.location.origin) {
					return dispatch({
						type: 'LOGIN_ERROR',
						payload: { iFrameIsVisible: false, authModalIsVisible: false },
						error: `'origin' [${origin}] not allowed`,
					});
				}
			}

			if (data?.type === 'onload' && data?.result === 'success') {
				return dispatch({ type: 'LOGIN_STARTED' });
			}

			if (data?.code) {
				dispatch({
					type: 'EXCHANGE_CODE',
					payload: {
						tokenParams: {
							...tokenParams,
							authorizationCode: data?.code,
							interactionCode: data?.interaction_code,
						},
					},
				});
			}
		};

		// const timeoutId = setTimeout(() => {
		// 	return resolve(new Error('OAuth flow timed out'));
		// }, 120000);

		const resolve = error => {
			if (error) {
				throw error;
			}

			// clearTimeout(timeoutId);

			window.removeEventListener('message', responseHandler);
		};

		window.addEventListener('message', responseHandler);

		return () => resolve();
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
				{isLoadingLogin && <Loader />}
				{authUrl && iFrameIsVisible && (
					<iframe
						src={authUrl}
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
