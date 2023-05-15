'use strict';

const { expect } = require('chai');

const waitForMs = require('./wait-for-ms');
const retryOn401 = require('./retry-on-401');
const getHeaders = require('./get-headers');
const specHelper = require('../specs/helper');

describe('retryOn401', () => {
	let callCount = 0;
	let tokenProviderCallCount = 0;
	let lastHeaders, lastCtx, lastArg1, lastArg2;
	const tp = async () => {
		tokenProviderCallCount++;

		return specHelper.getFakeToken();
	};
	beforeEach(() => {
		callCount = 0;
		tokenProviderCallCount = 0;
		lastHeaders = null;
		lastCtx = null;
		lastArg1 = null;
		lastArg2 = null;
		delete tp.__currentToken;
	});

	const func = async ({ arg1, arg2, headers, ctx }) => {
		// console.log('Func call: ', callCount);
		lastHeaders = headers;
		lastCtx = ctx;
		lastArg1 = arg1;
		lastArg2 = arg2;
		callCount++;
		await waitForMs(10);
		if (callCount < 2) {
			return {
				statusCode: 401,
			};
		}
		return {
			statusCode: 200,
		};
	};

	it('retries configured amout of times', async () => {
		const res = await retryOn401({
			fn: func,
			options: {
				arg1: 'arg1',
				arg2: 'arg2',
			},
			getHeaders,
			tokenProvider: tp,
			ctx: { config: { authErrorRetryCount: 2 }, log: specHelper.fakeLogger },
		});
		expect(res.statusCode).to.equal(200);
		expect(callCount).to.equal(2);
		expect(tokenProviderCallCount).to.equal(2);
		expect(lastHeaders).to.exist;
		expect(lastCtx).to.eql({
			config: { authErrorRetryCount: 2 },
			log: specHelper.fakeLogger,
		});
		expect(lastArg1).to.equal('arg1');
		expect(lastArg2).to.equal('arg2');
	});
	it('retries configured amout of times', async () => {
		const res = await retryOn401({
			fn: func,
			options: {
				arg1: 'arg1',
				arg2: 'arg2',
			},
			getHeaders,
			tokenProvider: tp,
			ctx: { config: { authErrorRetryCount: 1 }, log: specHelper.fakeLogger },
		});
		expect(res.statusCode).to.equal(401);
		expect(callCount).to.equal(1);
		expect(tokenProviderCallCount).to.equal(2);
	});
	it('returns on first when non 401 status code ', async () => {
		const res = await retryOn401({
			fn: func,
			options: {
				arg1: 'arg1',
				arg2: 'arg2',
			},
			getHeaders,
			tokenProvider: tp,
			ctx: { config: { authErrorRetryCount: 4 }, log: specHelper.fakeLogger },
		});
		expect(res.statusCode).to.equal(200);
		expect(callCount).to.equal(2);
		expect(tokenProviderCallCount).to.equal(2);
	});

	it('merges "ctx" into options', async () => {
		await retryOn401({
			fn: func,
			options: {
				arg1: 'arg1',
				arg2: 'arg2',
			},
			getHeaders,
			tokenProvider: tp,
			ctx: { config: { authErrorRetryCount: 2 }, log: specHelper.fakeLogger },
		});
		expect(lastCtx).to.eql({
			config: { authErrorRetryCount: 2 },
			log: specHelper.fakeLogger,
		});
	});
	it('merges "headers" into options', async () => {
		await retryOn401({
			fn: func,
			options: {
				arg1: 'arg1',
				arg2: 'arg2',
			},
			getHeaders,
			tokenProvider: tp,
			ctx: { config: { authErrorRetryCount: 2 }, log: specHelper.fakeLogger },
		});
		expect(lastHeaders).to.exist;
	});
	it('passes other options as argument to the function', async () => {
		await retryOn401({
			fn: func,
			options: {
				arg1: 'arg1',
				arg2: 'arg2',
			},
			getHeaders,
			tokenProvider: tp,
			ctx: { config: { authErrorRetryCount: 2 }, log: specHelper.fakeLogger },
		});
		expect(lastArg1).to.equal('arg1');
		expect(lastArg2).to.equal('arg2');
	});
});
