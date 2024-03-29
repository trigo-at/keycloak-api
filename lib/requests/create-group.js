'use strict';

const {isNil} = require('ramda');
const fetchAPI = require('../fetch-api');

module.exports = async ({realm, group, parentGroupId, headers, ctx}) => {
	const res = isNil(parentGroupId)
		? await fetchAPI({
				method: 'post',
				endpoint: `${ctx.config.authorizationEndpoint}`,
				urlPart: `/admin/realms/${realm}/groups`,
				body: group,
				headers,
		  })
		: await fetchAPI({
				method: 'post',
				endpoint: `${ctx.config.authorizationEndpoint}`,
				urlPart: `/admin/realms/${realm}/groups/${encodeURIComponent(
					parentGroupId
				)}/children`,
				body: group,
				headers,
		  });
	return res;
};
