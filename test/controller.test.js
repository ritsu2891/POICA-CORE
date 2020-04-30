require('../app/index.js');
const { updb, downdb } = require('./util.js');
const models = require('../app/models');
const User = models.User;
const Card = models.Card;
const CardMaster = models.CardMaster;
const cardController = require('../app/controllers/card.controller.js');
const cardMasterController = require('../app/controllers/cardmaster.controller.js');

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
  afterEach(async function(done) {
    await Card.destroy({
      where: {
        ownerUserId: testUserId
      }
    });
    done();
  });

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

  describe('add', () => {
    test('正常系: 通常公開のカードを追加', async function(done) {
      var cards = await cardController.list();
      expect(cards.length).toBe(0);
      const master = await CardMaster.create({
        ownerUser: testUserId+1,
        showInList: true,
        regByURL: true,
      });
      await cardController.add(master.id, '');
      cards = await cardController.list();
      expect(cards.length).toBe(1);
      const card = cards[0];
      expect(card.masterId).toBe(master.id);
      expect(card.point).toBe(0);
      done();
    });

    test('正常系: URL登録のみ有効のカードを追加', async function(done) {
      var cards = await cardController.list();
      expect(cards.length).toBe(0);
      const master = await CardMaster.create({
        ownerUser: testUserId+1,
        showInList: true,
        regByURL: true,
      });
      await cardController.add(master.id, master.regToken);
      cards = await cardController.list();
      expect(cards.length).toBe(1);
      const card = cards[0];
      expect(card.masterId).toBe(master.id);
      expect(card.point).toBe(0);
      done();
    });

    test('異常系: URL登録のみ有効のカードでトークンが異なる', async function(done) {
      var cards = await cardController.list();
      expect(cards.length).toBe(0);
      const master = await CardMaster.create({
        ownerUser: testUserId+1,
        showInList: false,
        regByURL: true,
      });
      try {
        await cardController.add(master.id, '');
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('異常系: ユーザによるカードの追加が拒否されているカードを追加 (リスト経由登録・URL登録が共に無効)', async function(done) {
      var cards = await cardController.list();
      expect(cards.length).toBe(0);
      const master = await CardMaster.create({
        ownerUser: testUserId+1,
        showInList: false,
        regByURL: false,
      });
      try {
        await cardController.add(master.id, '');
        fail();
      } catch (e) {
        // OK
      }
      done();
    });
  })
});

describe('cardmaster', () => {
  beforeEach(async function (done) {
    CardMaster.destroy({
      where: {},
      truncate: true
    });
    done();
  });

  test('list', async function (done) {
    var masters = await cardMasterController.list();
    expect(masters.length).toBe(0);

    await CardMaster.create({
      ownerUserId: testUserId+1,
      style: 1,
      showInList: true,
      regByURL: true
    });
    var masters = await cardMasterController.list();
    expect(masters.length).toBe(0);

    const newMaster = await CardMaster.create({
      ownerUserId: testUserId,
      style: 1,
      showInList: true,
      regByURL: true
    });
    masters = await cardMasterController.list();
    expect(masters.length).toBe(1);
    const master = masters[0];
    expect(master.style).toBe(1);
    expect(master.showInList).toBe(true);
    expect(master.regByURL).toBe(true);
    expect(master.regToken).toBe(newMaster.regToken);

    done();
  });

  test('add', async function (done) {
    var masters = await cardMasterController.list();
    expect(masters.length).toBe(0);

    const opts = {
      style: 5,
      showInList: false,
      regByURL: true,
    };
    await cardMasterController.add(opts);

    masters = await cardMasterController.list();
    console.log(masters);
    expect(masters.length).toBe(1);
    const master = masters[0];
    expect(master.style).toBe(opts.style);
    expect(master.showInList).toBe(opts.showInList);
    expect(master.regByURL).toBe(opts.regByURL);

    done();
  });
});