// Coding is deliberately explicit: this prototype sends the input unchanged.
export const uncoded = { encode: bits => [...bits] };

export function randomBits(length, random = Math.random) {
  if (!Number.isInteger(length) || length < 1) throw new RangeError('Length must be a positive integer.');
  return Array.from({ length }, () => random() < 0.5 ? 0 : 1);
}

export function simulate({ bits, bobChannel, eveChannel, code = uncoded, random = Math.random }) {
  const transmitted = code.encode(bits);
  return {
    transmitted,
    bob: bobChannel.transmit(transmitted, random),
    eve: eveChannel.transmit(transmitted, random),
  };
}
