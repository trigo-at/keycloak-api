'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({
	realm, path, headers, ctx,
}) => {
	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/group-by-path/${encodeURIComponent(path)}`,
		headers,
	});
	return res;
};
