'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({ realm, headers, ctx }) => {
	const res = await fetchAPI({
		method: 'delete',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}`,
		headers,
	});
	return res;
};
