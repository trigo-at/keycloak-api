'use strict';

const {merge} = require('ramda');

module.exports = async ({fn, options, getHeaders, tokenProvider, ctx}) => {
	let tries = 0;
	let result;

	do {
		ctx.log.debug('Try: ', tries);
		const headers = await getHeaders({tokenProvider, ctx});
		result = await fn(merge(options, {headers, ctx}));
		if (result.statusCode !== 401) return result;
		await getHeaders({tokenProvider, ctx, forceTokenRefresh: true});
		tries++;
	} while (tries < ctx.config.authErrorRetryCount);

	return result;
};
