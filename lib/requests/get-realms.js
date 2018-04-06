'use strict';

const fetchAPI = require('../fetch-api.js');

module.exports = async ({headers, ctx}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: '/admin/realms',
		headers,
	});
	return res;
};
