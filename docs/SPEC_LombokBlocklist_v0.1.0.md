# SPEC LombokBlocklist v0.1.0

This document is the normative cross-language contract. Every language port MUST produce byte-identical output for all specified inputs. Deviations from this specification are bugs.

The keywords MUST, SHOULD and MAY are to be read as in RFC 2119. Last reviewed: 2026-10-07.

## 0. Reference standards

This library defines its own contract; there is no normative external standard except those named in the relevant sections.

## 1. Vectors

| File | Cases | SHA-256 |
|---|---|---|
| `vectors/lombokblocklist-vectors-v1.json` | 135 | `1961ab12e12c83fd7baae37c9963e6593508f7f0b1029d6e417c3bf0466bb794` |

## 2. Contract

1. A host is normalized as follows: leading and trailing space, tab, CR and LF are removed; only the letters A-Z are folded to a-z; one trailing dot is removed; the total length is 1..253; each label is 1..63 characters from [a-z0-9_-] and does not start or end with a hyphen. Anything else is invalid. IDN names MUST already be in punycode.
2. exact matches only that domain; subtree matches the domain and all its subdomains; wildcard matches only subdomains, not the apex.
3. On each side (allow, block) the matching rule with the most labels is selected. On the same node: at the apex exact takes precedence over subtree; for a subdomain wildcard takes precedence over subtree.
4. If any allow rule matches, the verdict is allow; otherwise if a block rule matches, block; otherwise none. An invalid host yields invalid.
5. Hosts format: lines of `IP host...`; # comments are removed; localhost, broadcasthost, ip6-* and 0.0.0.0 entries are ignored without being counted; rules are block exact. Domains format: one domain per line (subtree) or `*.domain` (wildcard); comments start with # or !. Adblock format: only `||host^` and `@@||host^` (subtree); any other non-comment line counts as skipped.
6. skipped counts tokens (hosts) or lines (domains, adblock) that produced no rule and are neither comments nor ignored entries.

## 3. Cross-language representation

String indexes and lengths are counted in code points; floating-point numbers use IEEE 754 doubles with the order of operations as written; large integers MUST NOT lose precision.

## 4. Non-goals

Regular expressions, full URL patterns, adblock options ($...), IDN-to-punycode conversion, and fetching lists over the network are not part of this library.

## 5. Contract change history

- 0.1.0: initial contract.
