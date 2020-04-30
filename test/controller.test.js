require('./jestCustom.js');
require('../app/index.js');
const { updb, downdb } = require('./util.js');
const models = require('../app/models');
const User = models.User;
const Card = models.Card;
const CardMaster = models.CardMaster;
const PointOpReq = models.PointOpReq;
const cardController = require('../app/controllers/card.controller.js');
const cardMasterController = require('../app/controllers/cardmaster.controller.js');
const pointController = require('../app/controllers/point.controller.js');

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
    expect(masters.length).toBe(1);
    const master = masters[0];
    expect(master.style).toBe(opts.style);
    expect(master.showInList).toBe(opts.showInList);
    expect(master.regByURL).toBe(opts.regByURL);

    done();
  });
});

describe('point', () => {
  describe('give', () => {
    beforeEach(async function (done) {
      CardMaster.destroy({
        where: {},
        truncate: true
      });
      Card.destroy({
        where: {},
        truncate: true
      });
      done();
    });

    test('異常系: 宛先直接指定なのに付与対象カードを指定していない', async function(done) {
      opt = {
        media: 'direct',
        masterid: 5,
      };
      try {
        await pointController.give(opt);
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('異常系: UUID指定で付与対象カードも付与対象カードマスタのどちらも指定していない。', async function(done) {
      opt = {
        media: 'uuid',
        // cardid: _,
      };
      try {
        await pointController.give(opt);
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('異常系: 付与対象カードマスタの権限者でないにも関わらず権限者としてポイントを与える', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId+1,
      });
      const targetCard = await Card.create({
        ownerUserId: testUserId+2,
        masterId: master.id
      })
      
      opt = {
        as: 'admin',
        media: 'direct',
        cardId: targetCard.id
      };
      try {
        await pointController.give(opt);
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('異常系: 付与対象カードマスタで利用者間のポイント付与が許可されていないにも関わらず使用者としてポイントを与える', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId+1,
        userToUserPointOp: false,
      });
      const targetCard = await Card.create({
        ownerUserId: testUserId+2,
        masterId: master.id
      })
      
      opt = {
        as: 'user',
        media: 'direct',
        cardId: targetCard.id
      };
      try {
        await pointController.give(opt);
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('異常系: 付与対象カードマスタの使用者でないにも関わらず使用者としてポイントを与える', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId+1,
        userToUserPointOp: true,
      });
      const targetCard = await Card.create({
        ownerUserId: testUserId+2,
        masterId: master.id
      })
      
      opt = {
        as: 'user',
        media: 'direct',
        cardId: targetCard.id
      };
      try {
        await pointController.give(opt);
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('異常系: 付与量として数値以外を与える', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId,
      });
      const targetCard = await Card.create({
        ownerUserId: testUserId+2,
        masterId: master.id
      })
      
      opt = {
        as: 'admin',
        media: 'direct',
        cardId: targetCard.id,
        optype: 'point-free',
        value: 'Foo',
      };
      try {
        await pointController.give(opt);
        fail();
      } catch (e) {
        // OK
      }
      done();
    });

    test('正常系: マスタ権限者がカードを指定して直接ポイントを与える', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId,
      });
      const targetCard = await Card.create({
        ownerUserId: testUserId+2,
        masterId: master.id,
        point: 150
      })
      
      opt = {
        as: 'admin',
        media: 'direct',
        cardId: targetCard.id,
        optype: 'point-free',
        value: '100',
      };
      await pointController.give(opt);

      await targetCard.reload();
      expect(targetCard.point).toBe(150 + 100);
      done();
    });

    test('正常系: 同じマスタのカード使用者がカードを指定して直接ポイントを与える', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId,
        userToUserPointOpt: true
      });
      const operatorCard = await Card.create({
        ownerUserId: testUserId,
        masterId: master.id,
        point: 100
      });
      const targetCard = await Card.create({
        ownerUserId: testUserId+2,
        masterId: master.id,
        point: 250
      });
      
      opt = {
        as: 'user',
        media: 'direct',
        cardId: targetCard.id,
        optype: 'point-free',
        value: '100',
      };
      await pointController.give(opt);

      await targetCard.reload();
      expect(targetCard.point).toBe(250 + 100);
      done();
    });

    test('正常系: マスタ権限者がポイント付与用のUUIDを発行する', async function(done) {
      const master = await CardMaster.create({
        ownerUserId: testUserId,
      });
      
      opt = {
        as: 'admin',
        media: 'uuid',
        masterId: master.id,
        opType: 'f',
        value: '300',
      };
      const res = await pointController.give(opt);

      expect(res.token).toBeUUID();

      const opReq = await PointOpReq.findOne({
        where: {
          token: res.token
        }
      });

      expect(opReq.operatorUserId).toBe(testUserId);
      expect(Number(opReq.value)).toBe(Number(opt.value));
      expect(opReq.masterId).toBe(master.id);

      done();
    });

  });
});

/*
opt = {
  as: 'admin' | 'user',
  media: 'direct' | 'uuid',
  masterid: _,
  cardid: _,
  optype: 'f',
  value: _,
};
*/