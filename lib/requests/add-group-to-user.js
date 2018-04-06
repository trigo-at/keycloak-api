'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, userId, groupId, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'put',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}/groups/${groupId}`,
		timeout: 60000,
		headers,
	});
	return res;
};
