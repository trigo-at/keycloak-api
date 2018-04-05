'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: '/admin/realms',
		body: realm,
		headers,
	});
	return res;
};
