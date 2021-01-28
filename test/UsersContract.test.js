const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);

const { abi, bytecode } = require('../scripts/compile');

let accounts;
let usersContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  usersContract = await new web3.eth.Contract(JSON.parse(abi))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
  console.log(`Contract address ${usersContract.options.address}`);
});

describe('Users Contract', async () => {
  it('Should deploy', () => {
    assert.ok(usersContract.options.address);
  });

  it('Should join a user', async () => {
    let name = 'Nicolás';
    let surename = 'Apolonia';

    await usersContract.methods.join(name, surename).send({ from: accounts[0], gas: '500000' });
  });

  it('Should retrieve a user', async () => {
    const name = 'Nicolás';
    const surename = 'Apolonia';

    await usersContract.methods.join(name, surename).send({ from: accounts[0], gas: '500000' });

    const user = await usersContract.methods.getUser(accounts[0]).call();

    assert.strictEqual(name, user[0]);
    assert.strictEqual(surename, user[1]);
  });

  it('Should not allow joining a user twice', async () => {
    await usersContract.methods
      .join('Nicolás', 'Apolonia')
      .send({ from: accounts[1], gas: '500000' });

    try {
      await usersContract.methods
        .join('Luca', 'Berizzo Apolonia')
        .send({ from: accounts[1], gas: '500000' });
      assert.fail("Same account can't join twice");
    } catch (error) {
      if (error instanceof AssertionError) {
        assert.fail(error.message);
      }
    }
  });

  it('Should not allow retrieving a not registered user', async () => {
    try {
      await usersContract.methods.getUser(accounts[0]).call();
      assert.fail('User should not be registered');
    } catch (error) {
      if (error instanceof AssertionError) {
        assert.fail(error.message);
      }
    }
  });

  it('Should retrieve total registered users', async () => {
    await usersContract.methods
      .join('Nicolás', 'Apolonia')
      .send({ from: accounts[0], gas: '500000' });

    await usersContract.methods
      .join('Luca', 'Berizzo Apolonia')
      .send({ from: accounts[1], gas: '500000' });

    const total = await usersContract.methods.totalUsers().call();
    assert.strictEqual(parseInt(total), 2);
  });
});
