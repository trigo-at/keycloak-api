'use strict';

const queryString = require('querystring');
const fetch = require('node-fetch');
const FormData = require('form-data');
const {
	omit, path, mergeDeepRight, merge,
} = require('ramda');

async function parseReponse(response) {
	if (typeof response === 'function') {
		throw new Error('Shit happened!');
	}

	if (response.status === 204) {
		return { statusCode: 204 };
	}
	let data;
	if (response.headers.get('content-type') && response.headers.get('content-type').indexOf('application/json') !== -1) {
		data = await response.json();
	} else {
		data = await response.text();
	}
	if (response.status >= 400 && data && data.statusCode) {
		return data;
	}
	const res = { data, statusCode: response.status };
	return res;
}

async function fetchWithRetry(url, options, maxRetries = 2, retryCount = 0) {
	const response = await fetch(url, options);
	if (response.status === 423 && retryCount < maxRetries)	{
		return fetchWithRetry(url, options, maxRetries, retryCount + 1);
	}
	return response;
}

async function fetchAPI(opts) {
	if (!opts.endpoint) {
		throw new Error('Endpoint not set!');
	}
	let authroization;
	if (opts.token) {
		authroization = `Bearer ${opts.token}`;
	} else if (opts.basicAuth) {
		const auth = Buffer.from(`${opts.basicAuth.username}:${opts.basicAuth.password}`, 'utf8').toString('base64');
		authroization = `Basic ${auth}`;
	}

	const base = {
		method: 'GET',
		headers: merge({
			authorization: authroization,
			'content-type': 'application/json',
			'x-requested-with': 'XMLHttpRequest',
		}, opts.headers || {}),
		timeout: 30000000,
	};


	const omitProps = [
		'token',
		'basicAuth',
		'urlPart',
		'options',
		'endpoint',
		'headers',
	];

	const options = mergeDeepRight(base, omit(omitProps, opts));
	// console.log(options)
	if (Buffer.isBuffer(options.body)) {
		// Body is a binary buffer, leave it as it is
	}	else if (options.body instanceof FormData)	{
		// Body is FormData object, leave it as it is
	}	else if (options.body && typeof options.body === 'object') {
		options.body = JSON.stringify(options.body);
	}

	let { endpoint } = opts;

	if (endpoint.endsWith('/')) {
		endpoint = endpoint.slice(0, -1);
	}
	let { urlPart } = opts;
	if (urlPart && urlPart.startsWith('/')) {
		urlPart = urlPart.slice(1);
	}
	const query = queryString.stringify(opts.options);
	const url = urlPart ? `${endpoint}/${urlPart}` : endpoint;
	const urlStr = query ? `${url}?${query}` : url;
	// console.log(urlStr);
	const response = await fetchWithRetry(urlStr, options, path(['options', 'maxRetries'], opts || 2));
	return parseReponse(response);
}

module.exports = fetchAPI;
