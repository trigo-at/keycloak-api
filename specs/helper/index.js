'use strict';

const fs = require('fs');

const toCamelCase = hyphens => hyphens.replace(/-([a-z])/g, g => g[1].toUpperCase());
const libs = fs.readdirSync(__dirname).filter(f => f.indexOf('index.js') === -1 && f.indexOf('specs.js') === -1).map(f => f.replace(/\.js/g, ''));
const library = {};

libs.forEach((lib) => {
	library[toCamelCase(lib)] = require(`./${lib}.js`); // eslint-disable-line
});

module.exports = library;
