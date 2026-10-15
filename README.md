# Wiretap Lab

A small, dependency-free BEC wiretap-channel learning prototype. This sends raw random bits: **it does not implement secrecy coding or guarantee secrecy**.

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
