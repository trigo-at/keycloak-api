'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, clientId, headers, ctx,
}) => {
	const getClientsolesReq = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}/roles`,
		timeout: 60000,
		headers,
	});
	return getClientsolesReq;
};
