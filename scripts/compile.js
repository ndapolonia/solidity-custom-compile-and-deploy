const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '../contracts', 'UsersContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const data = solc.compile(source, 1).contracts[':UsersContract'];

module.exports = { abi: data['interface'], bytecode: data['bytecode'] };
