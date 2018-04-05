'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, groupId, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/groups/${encodeURIComponent(groupId)}`,
		headers,
	});
	return res;
};
