// Input conversion is independent of channels and coding. UTF-8 uses 8 bits/byte.
export const MAX_MESSAGE_BITS = 2048;

export function textToBits(text) {
  return Array.from(new TextEncoder().encode(text)).flatMap(byte =>
    Array.from({ length: 8 }, (_, i) => (byte >> (7 - i)) & 1));
}

export function parseBinary(value) {
  if (!/^[01\s]*$/.test(value)) throw new Error('Binary input accepts only 0, 1, and whitespace.');
  return Array.from(value.replace(/\s/g, ''), Number);
}

export function formatBits(bits) {
  return Array.from({ length: Math.ceil(bits.length / 8) }, (_, i) =>
    bits.slice(i * 8, i * 8 + 8).map(bit => bit === null ? '?' : bit).join('')).join(' ');
}

// Decode only received data, never consult Alice's text or fill erased bits.
// Known byte runs decode as UTF-8; an erased byte is shown as □.
export function bitsToText(bits) {
  if (bits.length % 8 !== 0) return null;
  const decoder = new TextDecoder('utf-8');
  let output = '';
  let bytes = [];
  const flush = () => { output += decoder.decode(Uint8Array.from(bytes)); bytes = []; };
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    if (byte.includes(null)) { flush(); output += '□'; }
    else bytes.push(byte.reduce((value, bit) => value * 2 + bit, 0));
  }
  flush();
  return output;
}
