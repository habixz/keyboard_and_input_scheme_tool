const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const code = fs.readFileSync(require('path').join(__dirname, 'evaluator.js'), 'utf8');

const ctx = {
  console,
  setTimeout,
  clearTimeout,
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  window: {},
  document: {
    getElementById: () => null,
    createElement: () => ({ style: {}, appendChild: () => {}, setAttribute: () => {} }),
  },
  alert: () => {},
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
};

vm.createContext(ctx);
vm.runInContext(code, ctx, { filename: 'evaluator.js' });

assert.strictEqual(ctx.is_iuv_swap('i', 'u'), true);
assert.strictEqual(ctx.is_iuv_swap('i', 'k'), false);

const fakeSwapCtx = {
  key_is_symbol_by_key: { i: false, u: false, k: false, l: false },
  key_is_empty_by_key: { i: false, u: false, k: false, l: false },
  key_tokens: {
    i: ['in', 'ing'],
    u: ['un', 'ong'],
    k: ['an'],
    l: ['en'],
  },
  all_sheng_tokens_by_key: {
    i: ['zh'],
    u: ['ch'],
    k: ['k'],
    l: ['l'],
  },
  all_yun_tokens_by_key: {
    i: ['i'],
    u: ['u'],
    k: ['an'],
    l: ['en'],
  },
};

const swapIu = ctx.get_swap_token_sets_yun_only(fakeSwapCtx, 'i', 'u');
assert.deepStrictEqual(swapIu.first_tokens, ['zh']);
assert.deepStrictEqual(swapIu.second_tokens, ['ch']);

const swapKl = ctx.get_swap_token_sets_yun_only(fakeSwapCtx, 'k', 'l');
assert.deepStrictEqual(swapKl.first_tokens, ['an']);
assert.deepStrictEqual(swapKl.second_tokens, ['en']);

const state = {
  sm_values: { i: 'zh', u: 'ch', k: 'k' },
  py_values: { i: 'in', u: 'un', k: 'an', l: 'en' },
  symbol_tags: {},
};

ctx.apply_swap_to_state_yun_only(state, 'i', 'u');
assert.strictEqual(state.sm_values.i, 'ch');
assert.strictEqual(state.sm_values.u, 'zh');
assert.strictEqual(state.py_values.i, 'in');
assert.strictEqual(state.py_values.u, 'un');

ctx.apply_swap_to_state_yun_only(state, 'k', 'l');
assert.strictEqual(state.py_values.k, 'en');
assert.strictEqual(state.py_values.l, 'an');

const state2 = {
  sm_values: { a: 'a', k: 'k' },
  py_values: { a: '', k: 'an' },
  symbol_tags: {},
};
ctx.apply_swap_to_state(state2, 'sheng', 'a', 'k');
assert.strictEqual(state2.sm_values.a, 'k');
assert.strictEqual(state2.sm_values.k, 'a');
assert.strictEqual(state2.py_values.a, 'an');
assert.strictEqual(state2.py_values.k, '');

console.log('OK');
