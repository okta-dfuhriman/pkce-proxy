/** @format */

import { Box, CircularProgress } from '@mui/material';

export const Loader = ({ size, overlay = false }) => (
	<Box
		sx={{
			backgroundColor: overlay ? 'rgba(255, 255, 255, 0.80)' : 'transparent',
			display: 'flex',
			height: '100%',
			width: '100%',
			justifyContent: 'center',
			alignContent: 'center',
			alignItems: 'center',
			float: 'left',
			zIndex: 5000,
			position: 'absolute',
			right: 0,
			top: 0,
		}}
	>
		<CircularProgress
			color='secondary'
			size={size ?? 65}
			sx={{
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		/>
	</Box>
);
