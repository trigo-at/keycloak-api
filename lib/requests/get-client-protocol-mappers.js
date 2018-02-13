'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, clientId, protocol, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}/protocol-mappers/protocol/${protocol}`,
		headers,
	});
	return res;
};

