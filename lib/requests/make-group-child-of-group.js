'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, parentGroupId, group, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/groups/${encodeURIComponent(
			parentGroupId
		)}/children`,
		timeout: 60000,
		body: group,
		headers,
	});
	return res;
};
