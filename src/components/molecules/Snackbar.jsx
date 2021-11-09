/** @format */

import { Alert } from '../../components';
import { Snackbar as MuiSnackbar } from '@mui/material';

export const Snackbar = props => {
	const { onClose, open, duration, severity, children } = props || {};

	const handleClose = (_, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		return onClose();
	};

	let anchor;

	switch (severity) {
		case 'error':
		case 'warning':
			anchor = { vertical: 'top', horizontal: 'center' };
			break;
		default:
			anchor = { vertical: 'bottom', horizontal: 'left' };
			break;
	}

	return (
		<MuiSnackbar
			open={open}
			autoHideDuration={duration ?? 6000}
			onClose={handleClose}
			anchorOrigin={anchor}
		>
			<Alert
				onClose={onClose ?? handleClose}
				severity={severity ?? 'info'}
				sx={{ w: '100%' }}
			>
				{children ?? 'This is a message'}
			</Alert>
		</MuiSnackbar>
	);
};
