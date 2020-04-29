const { updb, downdb } = require('./util.js');

beforeAll(() => {
  require('../app/index.js');
  updb();
});

afterAll(() => {
  downdb();
});

test('test', () => {
  expect(1).toBe(1);
});