'use strict';

const bb = require('bluebird');
const fetchAPI = require('./fetch-api');

module.exports = async ({ctx}) => {
	const tryAdminAuth = async () => {
		let res;
		try {
			res = await fetchAPI({
				method: 'get',
				endpoint: `${ctx.config.authorizationEndpoint}`,
				urlPart: '/',
			});
		} catch (e) {
			ctx.log.info(e.message);
			await bb.delay(500);
			return tryAdminAuth();
		}
		if (res.statusCode !== 200) {
			await bb.delay(500);
			ctx.log.info('Wait for auth endpoint to become available...');
			return tryAdminAuth();
		}

		return true;
	};

	await tryAdminAuth();
};
