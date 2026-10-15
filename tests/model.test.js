import test from 'node:test';
import assert from 'node:assert/strict';
import { binaryErasureChannel as bec, becSecrecyCapacity } from '../js/channels.js';
import { randomBits, simulate } from '../js/simulation.js';

test('BEC endpoints preserve or erase all bits without mutating input', () => {
  const bits = [0, 1, 1, 0];
  assert.deepEqual(bec(0).transmit(bits, () => 0), bits);
  assert.deepEqual(bec(1).transmit(bits, () => 0.999), [null, null, null, null]);
  assert.deepEqual(bits, [0, 1, 1, 0]);
});
test('erasures retain bit positions and never flip received values', () => {
  const draws = [0.1, 0.7, 0.3, 0.9];
  assert.deepEqual(bec(0.5).transmit([1, 0, 1, 1], () => draws.shift()), [null, 0, null, 1]);
});
test('theory handles channel ordering, equality, and extremes', () => {
  assert.ok(Math.abs(becSecrecyCapacity(.2, .6) - .4) < 1e-12);
  assert.equal(becSecrecyCapacity(.6, .2), 0);
  assert.equal(becSecrecyCapacity(.5, .5), 0);
  assert.equal(becSecrecyCapacity(0, 1), 1);
  for (const p of [-.1, 1.1, NaN]) assert.throws(() => bec(p), RangeError);
});
test('simulation samples Bob and Eve independently from the same uncoded input', () => {
  const draws = [.1, .9, .9, .1];
  const result = simulate({ bits: [0, 1], bobChannel: bec(.5), eveChannel: bec(.5), random: () => draws.shift() });
  assert.deepEqual(result, { transmitted: [0, 1], bob: [null, 1], eve: [0, null] });
  assert.deepEqual(randomBits(3, () => .7), [1, 1, 1]);
});
