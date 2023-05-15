'use strict';

const fetchAPI = require('../fetch-api');

module.exports = async ({realm, component, headers, ctx}) => {
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/components`,
		body: component, //eslint-disable-line
		headers,
	});
	return res;
};
