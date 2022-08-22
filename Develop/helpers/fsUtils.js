const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

const writeToFile = util.promisify(fs.writeFile);


module.exports = { readFromFile, writeToFile };
