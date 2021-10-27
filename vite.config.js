/** @format */

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [reactRefresh()],
	build: {
		outDir: 'build',
	},
	server: {
		strictPort: true,
		hmr: {
			port: 443, // Run the websocket server on the SSL port
		},
	},
	resolve: {
		alias: {
			'@okta/okta-auth-js': '@okta/okta-auth-js/dist/okta-auth-js.umd.js',
		},
	},
});
