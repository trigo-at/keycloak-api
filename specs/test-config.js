'use strict';

module.exports = {
	keycloakApi: {
		authorizationEndpoint: process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
		clientId: 'admin-cli',
		username: 'admin',
		password: 'password',
	},
	serviceAccount: {
		clientId: 'provisioner-service',
		clientSecret: '00000000-0000-0000-0000-000000000042',
	},
	realm: 'oegb-verlag-test',
	clientId: 'erecht-web-test',
	clientSecret: 'secret',
	resetTokenTTL: 300, // 5 Minutes
};
