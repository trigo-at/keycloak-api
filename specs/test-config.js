'use strict';

module.exports = {
	authorizationEndpoint:
		process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
	// clientId: 'admin-cli',
	// username: 'admin',
	// password: 'password',
};
