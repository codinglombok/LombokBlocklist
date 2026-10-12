# Project Summary LombokBlocklist

## What it is

Universal domain-name rule matcher: exact, subtree and wildcard rules, allow-over-block precedence, and parsers for hosts, domain-list and adblock-style lists. Part of the Lombok Ecosystem.

## Why it exists

Anyone who matches host names against a set of rules needs the same things: strict normalization, a fast lookup structure, and predictable exception rules. This library provides them with no dependencies and identical results in every language.

## Main features

- Host name normalization (ASCII, lowercase, label and total length limits)
- Three rule kinds: exact, subtree (a domain and all its subdomains), wildcard (subdomains only)
- Allow always beats block; the most specific matching rule is returned
- Parsers for the hosts format, one-domain-per-line lists, and a small adblock subset (||domain^ and @@||domain^)
- Lookup in O(number of labels) on a reversed-label trie

## Current status

Version 0.1.0, not yet released. TypeScript and Python pass 135 vector cases. No other ports exist.

## Example use cases

- Domain filtering in a resolver, gateway, or DNS firewall
- Host filtering for an HTTP client or crawler (allow and deny lists)
- Sender or link filtering for email, forms, and forum moderation
- Router or IoT firmware that restricts connection targets (small memory footprint, no regular expressions)

## Known Limitations

- No regular expressions (deliberate: bounded matching time).
- IDN is not converted; input MUST be punycode.
- Only a very small adblock subset is supported.
- Rust, Go and PHP ports: NOT YET; only TypeScript and Python exist.
- The trie uses a Map per node; not yet optimized for millions of rules (no benchmark yet).

## Further information

SPEC: `SPEC_LombokBlocklist_v0.1.0.md`; API: `API_LombokBlocklist_v0.1.0.md`; guide: `guide_how_to_use_LombokBlocklist_v0.1.0.md`.

## Gap versus comparable libraries

Comparable: the blocklist engines inside popular DNS filtering products, tldts/psl, aho-corasick. Honest gap: this library does not match the speed of compressed automata; its strengths are an identical cross-language contract and documented allow/block semantics.
