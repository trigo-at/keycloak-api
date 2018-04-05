'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, role, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/roles`,
		body: role,
		headers,
	});
	return res;
};
