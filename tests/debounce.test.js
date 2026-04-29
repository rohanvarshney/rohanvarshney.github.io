const test = require('node:test');
const assert = require('node:assert');
const { debounce } = require('../assets/js/material-kit.js');

test('debounce tests', async (t) => {
  await t.test('should debounce multiple function calls', async () => {
    let callCount = 0;
    const increment = () => { callCount++ };
    const debouncedIncrement = debounce(increment, 50);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    assert.strictEqual(callCount, 0, 'should not be called immediately');

    await new Promise(resolve => setTimeout(resolve, 60));

    assert.strictEqual(callCount, 1, 'should be called once after timeout');
  });

  await t.test('should call immediately if immediate is true', async () => {
    let callCount = 0;
    const increment = () => { callCount++ };
    const debouncedIncrement = debounce(increment, 50, true);

    debouncedIncrement();
    assert.strictEqual(callCount, 1, 'should be called immediately');

    debouncedIncrement();
    debouncedIncrement();

    assert.strictEqual(callCount, 1, 'should not be called again immediately');

    await new Promise(resolve => setTimeout(resolve, 60));

    assert.strictEqual(callCount, 1, 'should not be called again after timeout');

    debouncedIncrement();
    assert.strictEqual(callCount, 2, 'should be called immediately again after timeout');
  });

  await t.test('should preserve context and arguments', async () => {
    let callArgs = null;
    let callContext = null;

    const obj = {
      val: 42,
      func: function(a, b) {
        callContext = this;
        callArgs = [a, b];
      }
    };

    obj.debouncedFunc = debounce(obj.func, 50);
    obj.debouncedFunc('hello', 'world');

    await new Promise(resolve => setTimeout(resolve, 60));

    assert.strictEqual(callContext, obj, 'context should be preserved');
    assert.deepStrictEqual(callArgs, ['hello', 'world'], 'arguments should be preserved');
  });
});
