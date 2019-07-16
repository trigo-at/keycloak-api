'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, query, headers, ctx}) =>
	fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/events`,
		options: query,
		timeout: 60000,
		headers,
	});
