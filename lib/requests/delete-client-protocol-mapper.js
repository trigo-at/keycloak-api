'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, clientId, mapperId, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'delete',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}/protocol-mappers/models/${mapperId}`,
		headers,
	});
	return res;
};

