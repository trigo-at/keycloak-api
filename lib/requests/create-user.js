'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, user, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users`,
		body: user,
		headers,
	});
	return res;
};
