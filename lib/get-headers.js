'use strict';

const getToken = require('./get-token');

module.exports = async ({tokenProvider, ctx, forceTokenRefresh}) => {
	if (!tokenProvider)
		throw new Error('Mandatory argument "tokenProvider" missing');

	const token = await getToken({tokenProvider, ctx, forceTokenRefresh});

	return {
		authorization: `Bearer ${token}`,
		accept: 'application/json',
		'content-type': 'application/json',
	};
};
