import { repetitionCode } from './coding.js';

export const uncoded = repetitionCode(1);

export function randomBits(length, random = Math.random) {
  if (!Number.isInteger(length) || length < 1) throw new RangeError('Length must be a positive integer.');
  return Array.from({ length }, () => random() < 0.5 ? 0 : 1);
}

export function simulate({ bits, bobChannel, eveChannel, code = uncoded, random = Math.random }) {
  const transmitted = code.encode(bits);
  const bob = bobChannel.transmit(transmitted, random);
  const eve = eveChannel.transmit(transmitted, random);
  return { transmitted, bob, eve, bobDecoded: code.decode(bob), eveDecoded: code.decode(eve) };
}
