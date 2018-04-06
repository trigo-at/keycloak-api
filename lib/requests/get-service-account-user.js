'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, clientId, headers, ctx}) => {
	const getServiceAccoutUserReq = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients/${clientId}/service-account-user`,
		timeout: 60000,
		headers,
	});
	return getServiceAccoutUserReq;
};
