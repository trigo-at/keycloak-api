'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, client, clientId, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'put',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}`,
		body: client,
		headers,
	});
	return res;
};

