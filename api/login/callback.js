/** @format */

module.exports = (req, res) => {
	const method = req?.method;

	console.debug(method);

	if (method === 'POST') {
		// console.debug(req?.headers);
		// const {
		// 	body: { id_token, access_token },
		// } = req || {};

		// let url = `${req?.headers['x-forwarded-proto']}://${req?.headers['x-forwarded-host']}/login/callback`,
		// 	idTokenHash = id_token ? `id_token=${id_token}` : ``,
		// 	accessTokenHash = access_token ? `access_token=${access_token}` : ``;

		// if (!id_token && !access_token) {
		// 	return res.status(404).send('No tokens!');
		// } else if (id_token && access_token) {
		// 	url = `${url}#${idTokenHash}&${accessTokenHash}`;
		// } else if (id_token && !access_token) {
		// 	url = `${url}#${idTokenHash}`;
		// } else if (access_token) {
		// 	url = `${url}#${accessTokenHash}`;
		// }

		const url = `${req?.headers['x-forwarded-proto']}://${req?.headers['x-forwarded-host']}/login/callback#id_token=${req?.body.id_token}`;
		console.debug('callback:', url);
		return res.redirect(302, url);
	}
};
