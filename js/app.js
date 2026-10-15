import { binaryErasureChannel, becSecrecyCapacity } from './channels.js';
import { randomBits, simulate } from './simulation.js';
import { textToBits, parseBinary, formatBits, bitsToText, MAX_MESSAGE_BITS } from './messages.js';

const $ = id => document.getElementById(id);
let run = 0;

const mode = () => document.querySelector('input[name="mode"]:checked').value;
// JSON escaping makes control characters visible while preserving Unicode letters.
const visibleText = text => JSON.stringify(text).slice(1, -1);

function render() {
  const bobErasure = Number($('bob').value) / 100;
  const eveErasure = Number($('eve').value) / 100;
  const bobChannel = binaryErasureChannel(bobErasure);
  const eveChannel = binaryErasureChannel(eveErasure);
  const capacity = becSecrecyCapacity(bobErasure, eveErasure);
  $('bob-value').value = `${Math.round(bobErasure * 100)}%`;
  $('eve-value').value = `${Math.round(eveErasure * 100)}%`;
  $('capacity').value = capacity.toFixed(2);
  $('capacity-bar').style.width = `${capacity * 100}%`;
  $('bob-capacity').textContent = `${bobChannel.capacity().toFixed(2)} bits/use`;
  $('eve-capacity').textContent = `${eveChannel.capacity().toFixed(2)} bits/use`;
  $('theory-note').textContent = capacity > 0
    ? 'Bob has the better channel. Suitable wiretap coding can exploit this advantage for reliable, secret communication.'
    : 'Eve’s channel is at least as good as Bob’s. The theoretical secrecy capacity for this model is zero.';

  let bits;
  try {
    bits = mode() === 'text' ? textToBits($('message-text').value) : parseBinary($('message-binary').value);
    if (!bits.length) throw new Error('Enter a message before simulating.');
    if (bits.length > MAX_MESSAGE_BITS) throw new Error('Message is too long. Use at most 256 UTF-8 bytes or 2,048 bits.');
  } catch (error) {
    $('message-error').textContent = error.message;
    return;
  }
  $('message-error').textContent = '';
  const result = simulate({ bits, bobChannel, eveChannel });
  $('source-message').textContent = mode() === 'text' ? visibleText($('message-text').value) : formatBits(bits);
  $('sent-bits').textContent = formatBits(result.transmitted);
  for (const receiver of ['bob', 'eve']) {
    $(`${receiver}-bits`).textContent = formatBits(result[receiver]);
    const text = bitsToText(result[receiver]);
    $(`${receiver}-text`).textContent = text === null
      ? 'Text unavailable: the bit count is not a multiple of 8.' : visibleText(text);
  }
  const n = result.transmitted.length;
  const head = document.createElement('tr');
  for (const label of ['Bit', ...Array.from({ length: n }, (_, i) => i + 1)]) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    head.append(cell);
  }
  $('bits-table').tHead.replaceChildren(head);
  const rows = [['Alice', result.transmitted], ['Bob', result.bob], ['Eve', result.eve]].map(([name, bits]) => {
    const row = document.createElement('tr');
    const label = document.createElement('th');
    label.scope = 'row';
    label.textContent = name;
    row.append(label);
    for (const bit of bits) {
      const cell = document.createElement('td');
      cell.textContent = bit === null ? '?' : bit;
      if (bit === null) cell.className = 'erased';
      row.append(cell);
    }
    return row;
  });
  $('bits-table').tBodies[0].replaceChildren(...rows);
  const received = bits => bits.filter(bit => bit !== null).length;
  $('bob-count').textContent = `${received(result.bob)} / ${n}`;
  $('eve-count').textContent = `${received(result.eve)} / ${n}`;
  $('bob-only').textContent = result.bob.filter((bit, i) => bit !== null && result.eve[i] === null).length;
  $('run-summary').textContent = `Transmission ${++run} · ${n} uncoded bits · Bob ε = ${bobErasure.toFixed(2)} · Eve ε = ${eveErasure.toFixed(2)}`;
}

$('transmit').addEventListener('click', render);
for (const id of ['bob', 'eve']) $(id).addEventListener('input', render);
for (const radio of document.querySelectorAll('input[name="mode"]')) radio.addEventListener('change', () => {
  $('text-input').hidden = mode() !== 'text';
  $('binary-input').hidden = mode() !== 'binary';
  render();
});
$('randomize').addEventListener('click', () => {
  $('message-binary').value = formatBits(randomBits(Number($('length').value)));
  render();
});
for (const id of ['message-text', 'message-binary']) $(id).addEventListener('input', () => {
  $('message-error').textContent = '';
  $('run-summary').textContent = 'Message edited. Click Simulate transmission to update the results below.';
});
render();
