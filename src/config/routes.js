/** @format */

import { LoginCallback, Home, Profile } from '../components';

export const routes = [
	{
		path: '/login/callback',
		component: LoginCallback,
	},
	{
		path: '/me',
		exact: true,
		isSecure: true,
		component: Profile,
	},
	{
		path: '/*',
		component: Home,
	},
];
