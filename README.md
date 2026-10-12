# LombokBlocklist

Universal domain-name rule matcher: exact, subtree and wildcard rules, allow-over-block precedence, and parsers for hosts, domain-list and adblock-style lists. Part of the Lombok Ecosystem.

## Why this library?

Anyone who matches host names against a set of rules needs the same things: strict normalization, a fast lookup structure, and predictable exception rules. This library provides them with no dependencies and identical results in every language.

## Features

- Host name normalization (ASCII, lowercase, label and total length limits)
- Three rule kinds: exact, subtree (a domain and all its subdomains), wildcard (subdomains only)
- Allow always beats block; the most specific matching rule is returned
- Parsers for the hosts format, one-domain-per-line lists, and a small adblock subset (||domain^ and @@||domain^)
- Lookup in O(number of labels) on a reversed-label trie

## Use cases

- Domain filtering in a resolver, gateway, or DNS firewall
- Host filtering for an HTTP client or crawler (allow and deny lists)
- Sender or link filtering for email, forms, and forum moderation
- Router or IoT firmware that restricts connection targets (small memory footprint, no regular expressions)

## Installation

Not yet published to any registry (0.1.0 has not been released). After release:

```
npm install lombokblocklist
pip install lombokblocklist
```

## API overview

- `normalizeHost(input) -> string | null`
- `parseList(text, format) -> { rules, skipped }`
- `new Blocklist(): add(rule) -> added|duplicate|invalid; load(text, format); match(host) -> { verdict, rule }; size`

Details: `docs/API_LombokBlocklist_v0.1.0.md`.

## Port status

| Port | Status |
|---|---|
| TypeScript (reference) | YES, passes all 135 vector cases |
| Python | YES, passes all 135 vector cases |
| Rust, Go, PHP | NOT YET |

## Standards implemented

The normative contract is in `docs/SPEC_LombokBlocklist_v0.1.0.md`; the vectors are in `vectors/lombokblocklist-vectors-v1.json`.

## Known limitations

- No regular expressions (deliberate: bounded matching time).
- IDN is not converted; input MUST be punycode.
- Only a very small adblock subset is supported.
- Rust, Go and PHP ports: NOT YET; only TypeScript and Python exist.
- The trie uses a Map per node; not yet optimized for millions of rules (no benchmark yet).

## Development

```
node --test typescript/test/vectors.test.ts   # TypeScript (Node 22+)
python -m pytest python/tests                 # Python 3.10+
node scripts/gen_vectors.ts                   # regenerate vectors from the TypeScript reference
```

## Lombok Ecosystem

Part of the [Lombok Ecosystem](https://github.com/codinglombok).

## License

Apache-2.0 OR MIT (see `LICENSE-APACHE` and `LICENSE-MIT`).
