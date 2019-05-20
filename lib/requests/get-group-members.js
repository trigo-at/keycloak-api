'use strict';

const queryString = require('querystring');
const {filter} = require('ramda');
const fetchAPI = require('../fetch-api');

module.exports = async ({realm, groupId, first, max, headers, ctx}) => {
	const options = queryString.stringify(filter(Boolean, {first, max}));

	const res = await fetchAPI({
		method: 'get',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/admin/realms/${realm}/groups/${encodeURIComponent(
			groupId
		)}/members${options ? `?${options}` : ''}`,
		headers,
	});
	return res;
};
