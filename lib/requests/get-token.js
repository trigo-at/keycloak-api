'use strict';

const fetchAPI = require('../fetch-api');
const qs = require('querystring');
const {reject, isNil} = require('ramda');

module.exports = async ({
	ctx,
	realm,
	username,
	password,
	clientId,
	clientSecret,
	grantType,
	refreshToken,
}) => {
	const body = reject(isNil, {
		username,
		password,
		client_id: clientId,
		client_secret: clientSecret,
		grant_type: grantType,
		refresh_token: refreshToken,
	});
	const res = await fetchAPI({
		method: 'post',
		endpoint: `${ctx.config.authorizationEndpoint}`,
		urlPart: `/realms/${realm}/protocol/openid-connect/token`,
		body: qs.stringify(body),
		timeout: ctx.config.timeout,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
		},
	});
	return res;
};
