// Repetition corrects erasures, not secrecy. BEC-specific decoding; no guessing.
export function repetitionCode(copies = 1) {
  if (!Number.isInteger(copies) || copies < 1 || copies > 9) {
    throw new RangeError('Copies must be an integer from 1 to 9.');
  }
  return {
    rate: 1 / copies,
    encode: bits => bits.flatMap(bit => Array(copies).fill(bit)),
    decode(observed) {
      if (observed.length % copies !== 0) throw new RangeError('Incomplete repetition block.');
      return Array.from({ length: observed.length / copies }, (_, i) => {
        const known = observed.slice(i * copies, (i + 1) * copies).filter(bit => bit !== null);
        // Conflicting copies cannot occur in a BEC; leave them unknown if supplied.
        return known.length && known.every(bit => bit === known[0]) ? known[0] : null;
      });
    },
    residualErasure: probability => probability ** copies,
  };
}
