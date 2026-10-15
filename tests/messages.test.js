import test from 'node:test';
import assert from 'node:assert/strict';
import { textToBits, parseBinary, bitsToText, formatBits } from '../js/messages.js';

test('UTF-8 round trips ASCII, Hebrew, emoji, whitespace, and empty text', () => {
  for (const text of ['Hello Bob!', 'שלום 🌍', 'a\n\tb', '']) {
    assert.equal(bitsToText(textToBits(text)), text);
  }
  assert.equal(formatBits(textToBits('A')), '01000001');
});
test('binary accepts whitespace, rejects other symbols, and preserves leading zeros', () => {
  assert.deepEqual(parseBinary('00 1\n0'), [0, 0, 1, 0]);
  assert.throws(() => parseBinary('10x1'));
  assert.equal(bitsToText([0, 1]), null);
});
test('erased bytes are unknown, never guessed from the original message', () => {
  const bits = textToBits('AB');
  bits[0] = null;
  assert.equal(bitsToText(bits), '□B');
  assert.equal(formatBits(bits), '?1000001 01000010');
  assert.equal(bitsToText(Array(16).fill(null)), '□□');
});
test('damaged multibyte text and invalid UTF-8 are explicit', () => {
  const bits = textToBits('éA');
  bits[0] = null;
  assert.equal(bitsToText(bits), '□�A');
  assert.equal(bitsToText(parseBinary('11111111')), '�');
});
