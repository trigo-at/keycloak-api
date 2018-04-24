'use strict';

const jwt = require('jsonwebtoken');
const Boom = require('boom');

const setCurrentToken = ({tokenProvider, token, ctx}) => {
	const decrypted = jwt.decode(token);
	let expiresAt;
	if (decrypted.exp) {
		const d = new Date();
		d.setTime(decrypted.exp * 1000);
		expiresAt = d;
	}
	// eslint-disable-next-line
	tokenProvider.__currentToken = {
		token,
		decrypted,
		expiresAt,
	};
	ctx.log.debug(new Date(), 'Caching new token that expires at', expiresAt);
};

const fetchToken = async ({tokenProvider, ctx}) => {
	ctx.log.debug('Fetching new access token...');
	tokenProvider.__fetchingToken = true; //eslint-disable-line
	let token;
	let attempt = 0;

	do {
		try {
			token = await tokenProvider();
			setCurrentToken({tokenProvider, token, ctx});
			const accessToken = tokenProvider.__currentToken.token;
			tokenProvider.__fetchingToken = false; //eslint-disable-line
			return accessToken;
		} catch (e) {
			ctx.log.error(e);
			attempt++;
		} finally {
			tokenProvider.__fetchingToken = false; //eslint-disable-line
		}
	} while (attempt < 3);

	throw Boom.internal(
		'Unable to fetch a access token with the given tokenProvider'
	);
};

module.exports = async ({tokenProvider, ctx, forceTokenRefresh}) => {
	if (forceTokenRefresh) {
		ctx.log.info('Forced token refresh...');
		return fetchToken({tokenProvider, ctx});
	}

	const inAMinute = new Date();
	inAMinute.setTime(inAMinute.getTime() + 50000);
	ctx.log.info('getToken()');
	if (tokenProvider.__currentToken) {
		ctx.log.info('tokenProvider.__currentToken.expiresAt');
		ctx.log.info({
			inAMinute,
			expiresAt: tokenProvider.__currentToken.expiresAt,
		});
	}
	if (
		tokenProvider.__currentToken &&
		(inAMinute <= tokenProvider.__currentToken.expiresAt ||
			!tokenProvider.__currentToken.expiresAt)
	) {
		ctx.log.info('Return cached token:');
		ctx.log.info(tokenProvider.__currentToken);
		return tokenProvider.__currentToken.token;
	}
	if (tokenProvider.__fetchingToken) {
		ctx.log.warn('Already fetching token returning cached...');
		return tokenProvider();
	}

	if (tokenProvider.__currentToken) {
		ctx.log.info(
			'Found expiring token:',
			tokenProvider.__currentToken.expiresAt
		);
	}

	return fetchToken({tokenProvider, ctx});
};
