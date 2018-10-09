'use strict';

const {merge} = require('ramda');
const debug = require('debug')('@trigo/keycloak-api:retry-on-401')

module.exports = async ({fn, options, getHeaders, tokenProvider, ctx}) => {
	let tries = 0;
	let result;

	do {
		const headers = await getHeaders({tokenProvider, ctx});
		result = await fn(merge(options, {headers, ctx}));
		if (result.statusCode !== 401) return result;
		await getHeaders({tokenProvider, ctx, forceTokenRefresh: true});
		tries++;
		debug(`Retry: ${tries}`);
	} while (tries < ctx.config.authErrorRetryCount);

	return result;
};
