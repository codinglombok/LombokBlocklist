# API LombokBlocklist v0.1.0

Reference language: TypeScript. The Python port uses snake_case names and returns tuples, dicts, or dataclasses with the same content. Stability: 0.x; changes may occur and are noted in the CHANGELOG. Since version: 0.1.0.

- `normalizeHost(input) -> string | null`
- `parseList(text, format) -> { rules, skipped }`
- `new Blocklist(): add(rule) -> added|duplicate|invalid; load(text, format); match(host) -> { verdict, rule }; size`

Input outside the ranges in the SPEC raises `RangeError` (TypeScript) or `ValueError` (Python); functions defined as total return a special value (null, invalid) as the SPEC states.

Cross-language compatibility: see SPEC section 3 and the vectors.
