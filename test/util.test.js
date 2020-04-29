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