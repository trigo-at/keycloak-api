'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, userId, password, temporary, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'put',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/users/${userId}/reset-password`,
		body: {
			type: 'password',
			value: password,
			temporary,
		},
		headers,
	});
	return res;
};
