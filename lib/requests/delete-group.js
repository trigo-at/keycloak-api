'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, groupId, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'delete',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/groups/${groupId}`,
		headers,
	});
	return res;
};
