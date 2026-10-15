import test from 'node:test';
import assert from 'node:assert/strict';
import { repetitionCode } from '../js/coding.js';
import { binaryErasureChannel } from '../js/channels.js';
import { simulate } from '../js/simulation.js';
import { textToBits, bitsToText } from '../js/messages.js';

test('repetition recovers from any surviving copy and preserves all-erased unknowns', () => {
  const code = repetitionCode(3);
  assert.deepEqual(code.encode([0, 1]), [0, 0, 0, 1, 1, 1]);
  assert.deepEqual(code.decode([null, 0, null, null, null, 1]), [0, 1]);
  assert.deepEqual(code.decode([null, null, null]), [null]);
  assert.deepEqual(code.decode([0, 1, null]), [null]);
  assert.throws(() => code.decode([0, 0]));
});
test('exhaustive erasure patterns give exact residual probability ε^r', () => {
  for (const r of [1, 3, 5, 7]) {
    const code = repetitionCode(r);
    for (const epsilon of [0, .2, .6, 1]) {
      let unknownProbability = 0;
      for (let mask = 0; mask < 2 ** r; mask++) {
        const observed = Array.from({ length: r }, (_, i) => mask & (1 << i) ? null : 1);
        const erased = observed.filter(bit => bit === null).length;
        const probability = epsilon ** erased * (1 - epsilon) ** (r - erased);
        if (code.decode(observed)[0] === null) unknownProbability += probability;
        else assert.equal(code.decode(observed)[0], 1);
      }
      assert.ok(Math.abs(unknownProbability - code.residualErasure(epsilon)) < 1e-12);
    }
  }
});
test('end-to-end UTF-8 decoding at perfect and fully erased channel endpoints', () => {
  const bits = textToBits('Hello שלום 🌍');
  for (const copies of [1, 3, 7]) {
    const result = simulate({ bits, code: repetitionCode(copies), bobChannel: binaryErasureChannel(0), eveChannel: binaryErasureChannel(1), random: () => .5 });
    assert.equal(result.transmitted.length, bits.length * copies);
    assert.equal(bitsToText(result.bobDecoded), 'Hello שלום 🌍');
    assert.ok(result.eveDecoded.every(bit => bit === null));
  }
});
test('identity mode and invalid repetition sizes', () => {
  assert.deepEqual(repetitionCode(1).decode([0, null, 1]), [0, null, 1]);
  for (const r of [0, -1, 1.5, 10, NaN]) assert.throws(() => repetitionCode(r));
});
