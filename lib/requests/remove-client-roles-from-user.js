'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, clientId, userId, roles, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'delete',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}/role-mappings/clients/${clientId}`,
		body: roles,
		timeout: 60000,
		headers,
	});
	return res;
};
