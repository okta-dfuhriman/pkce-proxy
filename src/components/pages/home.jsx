/** @format */

import * as React from 'react';
import {
	ProductHero,
	withRoot,
} from '../../components';

const HomeRoot = () => (
	<React.Fragment>
		<ProductHero />
	</React.Fragment>
);

export const Home = withRoot(HomeRoot);
