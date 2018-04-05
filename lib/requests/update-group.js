'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, group, groupId, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'put',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/groups/${groupId}`,
		body: group,
		headers,
	});
	return res;
};
