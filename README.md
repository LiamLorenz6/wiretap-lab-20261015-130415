# Wiretap Lab

A small, dependency-free BEC wiretap-channel learning prototype. Send text or binary with uncoded or repetition-coded transmission. **This does not implement secrecy coding or guarantee secrecy**.

## Run locally

From this directory, run `python3 -m http.server 8000` and open http://localhost:8000. JavaScript modules require serving over HTTP rather than opening index.html directly.

Run model checks with `npm test` (Node.js required; no installation needed).

## Structure

- `js/channels.js`: BEC transmission and BEC-specific capacity formulas. An erasure is `null`.
- `js/simulation.js`: random input, identity encoder, and channel orchestration; no DOM dependencies.
- `js/app.js`: controls and rendering.
- `index.html`, `styles.css`: static interface.

Bob and Eve observe the same transmitted sequence through independently sampled memoryless BECs. Their erasures need not be nested. For these BEC marginals, secrecy capacity is max(0, εE − εB); individual channel capacity is 1 − ε. These theoretical asymptotic rates require appropriate coding. Counts in a finite uncoded run are observations, not achieved secret rates.

Future channels can expose `transmit(bits, random)` and `capacity()`. Secrecy capacity is model-specific: do not reuse the BEC formula for a different channel family. The identity encoder is a starting point, not a full coding/decoding API. Add input conversion before simulation and decoding after channel transmission when needed.

## GitHub Pages

Push these files to a GitHub repository. In Settings → Pages, choose “Deploy from a branch,” select the branch containing the files, and select `/ (root)`. All asset URLs are relative, so project-repository Pages URLs work. No build step, server backend, credentials, or external dependencies are required. `.nojekyll` disables Jekyll processing.

Theory reference: [Coding for the Wiretap Channel, Chapter 2](https://www.diva-portal.org/smash/get/diva2%3A404831/FULLTEXT01.pdf).

## Message input

Choose Words / text to send your own UTF-8 message, or Binary to enter bits (whitespace is allowed). Text is limited to 256 UTF-8 bytes; binary is limited to 2,048 bits. The random-bit generator remains available in Binary mode. Clicking Simulate sends the same input with fresh noise. Channel changes also run the simulation; editing a message leaves the previous result visible until you simulate again.

`js/messages.js` handles conversion independently of coding and channels. The flow shows Alice's input → transmitted bits → received bits → recovered text for each receiver. A byte containing any erased bit displays as □. Known byte runs decode independently; incomplete or invalid UTF-8 displays as �. This intentionally does not guess erased data or consult the original text to reconstruct characters. Binary inputs whose length is not divisible by eight show bits without a text interpretation. Control characters are escaped for visibility.


## Repetition coding

The default is 3 copies per message bit (rate 1/3); choose uncoded, 3, 5, or 7 copies. `js/coding.js` exposes encode, decode, and rate. Both Bob and Eve use the same decoder: a bit is recovered if any copy survives; otherwise it stays unknown. The decoder receives channel observations only.

For independent BEC erasures, a repeated bit remains erased with probability ε^r. A whole byte is recovered with probability (1 − ε^r)^8. With εB = .2, εE = .6, and r = 3, these byte recovery probabilities are about 93.8% and 14.3%. These are expectations, not guarantees for one transmission or word recovery rates. Multibyte characters require several bytes. Increasing repetition improves Eve's recovery too; no secrecy is claimed. The secrecy-capacity display still describes the underlying channel, not the achieved rate of this code.

The pipeline distinguishes message bits, transmitted codeword, raw received codeword, decoded message bits, and recovered text. Summary counts refer to decoded message positions; the expandable table compares raw channel-use positions. Text conversion and channel/coding modules remain separate. Repetition is currently BEC-specific and is not a majority decoder for a BSC.
