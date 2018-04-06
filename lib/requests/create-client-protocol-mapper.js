'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, clientId, mapper, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}/protocol-mappers/models`,
		body: mapper,
		headers,
	});
	return res;
};
