# Development LombokBlocklist

## 1. Roadmap

- 0.1.1: CI, coverage, fuzz, publish to npm/PyPI
- 0.2.0: Rust port (no_std+alloc), Go, PHP; benchmark with millions of rules
- 0.3.0: optional IDN to punycode conversion; additional rule formats

## 2. Deferred scope

Regular expressions, full URL patterns, adblock options ($...), IDN-to-punycode conversion, and fetching lists over the network are not part of this library.

## 3. Design principles for contributors

- Contract first: change the SPEC and vectors before the code; differences between ports are bugs.
- No runtime dependencies; no clock, no network, no hidden randomness.
- Every README feature has a vector case or a test.
- No client or owning-application names in public files.
- No emoji in `*.md`.
- Documentation, comments, error messages and examples are written in English (the default language of all Lombok Ecosystem repositories).

## 4. How to contribute

Fork, create a `feat/...` branch, run both vector runners, update `API_` and `SPEC_` if behavior changes, and open a PR. Regenerate vectors with `node scripts/gen_vectors.ts` only when the contract changes, and review the vector diff.

## 5. Open questions

- Should the adblock format be extended with safe $ options?
- Node structure: Map or sorted array for the smallest memory footprint?
