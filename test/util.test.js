beforeAll(() => {
  require('../app/index.js');
});

describe('isEmpty', () => {
  const {isEmpty} = require('../app/util.js');

  test('空配列は空と判断する', () => {
    expect(isEmpty([])).toBe(true);
  });
  
  test('オブジェクトは空と判定しない', () => {
    expect(isEmpty({foo: 'foo'})).toBe(false);
  });

  test('オブジェクトの入った配列は空と判定しない', () => {
    expect(isEmpty([{foo: 'foo'}])).toBe(false);
  });
});

describe('filterObject', () => {
  const {filterObject} = require('../app/util.js');

  const srcObj = {
    'a': 1,
    'b': 4
  };
  const allowKey = ['a'];
  const resObj = filterObject(srcObj, allowKey);

  test('許可したキーの数だけ要素を残していること', () => {
    expect(Object.values(resObj).length).toBe(1);
  });

  test('許可したキーの名前で与えられたオブジェクトの同名のキーの要素を同じように持つこと', () => {
    expect(srcObj['a'] == resObj['a']).toBe(true);
  });

  test('許可していないキーのアイテムは残していないこと', () => {
    expect(resObj['b'] == undefined).toBe(true);
  });
});