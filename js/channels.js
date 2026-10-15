// A channel exposes transmit(bits, random) and capacity(). Erasures use null.
export function binaryErasureChannel(erasureProbability) {
  if (!Number.isFinite(erasureProbability) || erasureProbability < 0 || erasureProbability > 1) {
    throw new RangeError('Erasure probability must be between 0 and 1.');
  }
  return {
    transmit: (bits, random = Math.random) => bits.map(bit => random() < erasureProbability ? null : bit),
    capacity: () => 1 - erasureProbability,
  };
}

// Specific to the BEC wiretap model; other channel pairs need their own theory.
export function becSecrecyCapacity(bobErasure, eveErasure) {
  binaryErasureChannel(bobErasure);
  binaryErasureChannel(eveErasure);
  return Math.max(0, eveErasure - bobErasure);
}
