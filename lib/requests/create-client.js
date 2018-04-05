'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, client, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/clients`,
		body: client, //eslint-disable-line
		headers,
	});
	return res;
};
