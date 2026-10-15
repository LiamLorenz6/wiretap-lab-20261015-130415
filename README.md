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
