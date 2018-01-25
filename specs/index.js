'use strict';

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

function walk(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const newFile = `${dir}/${file}`;
		const stat = fs.statSync(newFile);
		if (stat && stat.isDirectory()) {
			results = results.concat(walk(newFile));
		} else {
			results.push(newFile);
		}
	});
	return results;
}

function loadTests() {
	const fileList = walk(path.join(__dirname, '..'))
		.filter(file => file.indexOf('.specs.js') > -1 &&
		file.indexOf('node_modules') === -1 &&
		file.indexOf('coverage') === -1 &&
		file.indexOf('__testservices') === -1 &&
		file.indexOf('.nyc_output') === -1).forEach((file) => {
		require(file); // eslint-disable-line
		});
	return fileList;
}

describe(pkg.name, async () => {
	try {
		loadTests();
	} catch (err) {
		console.error(err); // eslint-disable-line
	}
});
