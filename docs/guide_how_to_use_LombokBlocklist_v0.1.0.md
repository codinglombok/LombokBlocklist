# Usage Guide LombokBlocklist

## 1. Installation

After release: `npm install lombokblocklist` or `pip install lombokblocklist`. Before release, copy the `typescript/src` folder or `python/src/lombokblocklist` (no dependencies).

## 2. Basic concepts

Rules of kind exact, subtree, or wildcard are added to a Blocklist; match(host) normalizes the host and walks its labels from the right. Allow rules always beat block rules. Text lists are read with parseList or Blocklist.load in hosts, domains, or adblock format.

## 3. Examples

`examples/example.ts` and `examples/example.py` produce the following output (TypeScript; Python is identical except for print formatting):

```
ads.example.com block
x.tracker.example.net block
ok.tracker.example.net allow
example.org none
```

TypeScript code:

```ts
import { Blocklist } from "lombokblocklist";

const bl = new Blocklist();
bl.load("0.0.0.0 ads.example.com\n", "hosts");
bl.load("||tracker.example.net^\n@@||ok.tracker.example.net^\n", "adblock");
for (const h of ["ads.example.com", "x.tracker.example.net", "ok.tracker.example.net", "example.org"]) {
  console.log(h, bl.match(h).verdict);
}
```

## 4. Recipes

- Personal allow list: load a blocklist, then add allow rules with add({action:'allow',kind:'subtree',domain:'...'}).
- List quality check: call parseList and inspect skipped to find lines that are not supported.
- General filter: call normalizeHost(input) before comparing a host name with another source.

## 5. Common pitfalls

- No regular expressions (deliberate: bounded matching time).
- IDN is not converted; input MUST be punycode.
- Only a very small adblock subset is supported.
- Rust, Go and PHP ports: NOT YET; only TypeScript and Python exist.
- The trie uses a Map per node; not yet optimized for millions of rules (no benchmark yet).

## 6. See also

`SPEC_LombokBlocklist_v0.1.0.md`, `API_LombokBlocklist_v0.1.0.md`, `full_summary_project_LombokBlocklist_v0.1.0.md`.
