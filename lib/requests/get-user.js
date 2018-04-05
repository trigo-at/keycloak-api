'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, userId, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}`,
		headers,
	});
	return res;
};
