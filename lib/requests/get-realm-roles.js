'use strict';

const fetchAPI = require('../fetch-api.js');

module.exports = async ({ realm, headers, ctx }) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/roles`,
		headers,
	});
	return res;
};

