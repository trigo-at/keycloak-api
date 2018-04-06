'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, user, userId, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'put',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}`,
		body: user,
		headers,
	});
	return res;
};
