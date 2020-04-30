require('../app/index.js');
const { updb, downdb } = require('./util.js');
const models = require('../app/models');
const User = models.User;
const Card = models.Card;
const CardMaster = models.CardMaster;
const cardController = require('../app/controllers/card.controller.js');

const testUserId = 1;

beforeAll(async function(done) {
  updb();
  await User.create({
    id: 1,
    displayName: 'JestTestUser',
    accessToken: 'JEST_TOKEN'
  });
  done();
  return;
});

afterAll(() => {
  downdb();
});

describe('card', () => {
  test('list', done => {
    (async function () {
      var cards = await cardController.list();
      expect(cards.length).toBe(0);
      await Card.create({
        masterId: 1,
        ownerUserId: testUserId,
        point: 150
      });
      cards = await cardController.list();
      expect(cards.length).toBe(1);
      expect(cards[0].masterId).toBe(1);
      expect(cards[0].point).toBe(150);
      expect(cards[0].ownerUserId).toBe(undefined);
      done();
    })();
  });
});