/** @format */

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
	AppBar,
	AuthModal,
	LinkIconButton,
	LoadingButton,
	LoginButton,
	LogoutButton,
	Toolbar,
	Typography,
} from '../../components';
import { Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuthState } from '../../providers';

export const AppNavBar = () => {
	const {
		authModalIsVisible,
		isAuthenticated,
		user,
		isLoadingLogin,
		isLoadingProfile,
		isLoadingLogout,
	} = useAuthState();

	return (
		<AppBar>
			<AuthModal
				loginhint={user?.login}
				open={authModalIsVisible}
				onClose={() => {}}
			/>
			<Toolbar>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
					{isAuthenticated && (
						<div>
							<LinkIconButton to='/profile'>
								<AccountCircle />
								<Typography variant='subtitle1'>
									&nbsp;&nbsp;{user?.name}
								</Typography>
							</LinkIconButton>
						</div>
					)}
				</Box>
				<Link to='/' style={{ textDecoration: 'none' }}>
					<Typography
						variant='h6'
						component='div'
						color='white'
						sx={{ fontSize: 24, textAlign: 'center' }}
					>
						Atko International
					</Typography>
				</Link>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
					{!isLoadingProfile && !isLoadingLogin && isAuthenticated && (
						<Fragment>
							<LogoutButton
								isiconbutton='true'
								sx={{ color: 'secondary.main' }}
								loading={isLoadingLogout}
							/>
						</Fragment>
					)}
					{(isLoadingLogin || isLoadingProfile || !isAuthenticated) && (
						<Fragment>
							<div>
								<LoginButton loading={isLoadingLogin || isLoadingProfile} />
							</div>
						</Fragment>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
