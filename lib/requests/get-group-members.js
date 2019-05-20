'use strict';

const fetchAPI = require('../fetch-api');
const queryString = require('querystring');
const R = require('ramda');

module.exports = async ({realm, groupId, first, max, headers, ctx}) => {
	const options = queryString.stringify(R.filter(Boolean,{first, max}));
	
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
