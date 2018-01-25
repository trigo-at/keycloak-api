'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, clientId, userId, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}/role-mappings/clients/${clientId}/available`,
		timeout: 60000,
		headers,
	});
	return res;
};
