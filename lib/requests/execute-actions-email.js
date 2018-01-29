'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, userId, actions, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'put',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}/execute-actions-email`,
		body: actions,
		headers,
	});
	return res;
};
