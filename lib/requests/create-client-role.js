'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, clientId, role, headers, ctx,
}) => {
	const res = await fetchAPI({
		// method: 'post',
		// endpoint: `${ctx.config.authorizationEndpoint}/auth/admin/realms/${realm}/clients/${clientId}/roles`,
		// urlPart: '/',
		// body: role,
		// timeout: 60000,
		// headers,
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}/roles`,
		body: role,
		timeout: 60000,
		headers,
	});
	return res;
};
