'use strict';

const jwt = require('jsonwebtoken');

module.exports = async () =>
	jwt.sign(
		{
			data: 'foobar',
		},
		'secret',
		{expiresIn: 60 * 60}
	);
