'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, userId, roles, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
		body: roles,
		timeout: 60000,
		headers,
	});
	return res;
};
