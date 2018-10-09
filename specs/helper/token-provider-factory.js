'use strict';

const Boom = require('boom');
const cfg = require('../test-config');
const KeycloakApi = require('../../lib/keycloak-api');

module.exports = () => async () => {
	const api = new KeycloakApi(cfg);
	const adminTokenRes = await api.getToken({
		realm: 'master',
		clientId: 'admin-cli',
		grantType: 'password',
		username: 'admin',
		password: 'password',
	});
	if (adminTokenRes.statusCode !== 200) {
		throw new Boom('Auth error...', adminTokenRes);
	}
	return adminTokenRes.data.access_token;
};
