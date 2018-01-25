'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, query, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users`,
		options: query,
		headers,
	});
	return res;
};

