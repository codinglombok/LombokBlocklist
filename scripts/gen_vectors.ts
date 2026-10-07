import { writeFileSync } from "node:fs";
import { Blocklist, normalizeHost, parseList, type Format, type Rule } from "../typescript/src/index.ts";

const norm = [
  "example.com", "EXAMPLE.com", "Example.COM.", "  example.com  ", "a", "a.b.c.d.e.f", "xn--bcher-kva.example",
  "_dmarc.example.com", "-bad.example.com", "bad-.example.com", "a--b.example.com", "", ".", "..", "example..com",
  ".example.com", "example.com..", "exa mple.com", "exa_mple.com", "bücher.example", "例え.jp", "1.2.3.4", "0.0.0.0",
  "a".repeat(63) + ".com", "a".repeat(64) + ".com", ("a".repeat(61) + ".").repeat(4) + "com",
  ("a".repeat(63) + ".").repeat(3) + "a".repeat(61), ("a".repeat(63) + ".").repeat(3) + "a".repeat(62),
  "exa\tmple.com", "\texample.com\n", "EXAMPLE.COM\r\n", "ex@mple.com", "example.com/path", "example.com:80",
  "Zz9.Test", "localhost", "LOCALHOST.", "a.b-c.d", "a.-b.c", "a.b-.c", "*.example.com", "ex*mple.com",
];
const hosts = `# comment
127.0.0.1 localhost
::1 localhost ip6-localhost
0.0.0.0 ads.example.com tracker.example.net # trailing
0.0.0.0 ADS2.Example.com.
  0.0.0.0   spaced.example.org
badline
0.0.0.0
notanip evil.example.com
0.0.0.0 bad_host!.com ok.example.com
fe80::1%lo0 zone.example.com
255.255.255.255 broadcasthost
0.0.0.0 0.0.0.0
`;
const domains = `# comment
! other comment
example.com
*.wild.example.org
UPPER.Example.Net.
bad host.com
  spaced.example.com  
inline.example.com # note
*.
*.*.example.com
.leading.example.com
`;
const adblock = `[Adblock Plus 2.0]
! comment
||ads.example.com^
@@||good.ads.example.com^
||tracker.example.net^$third-party
||nocaret.example.com
||^
@@||^
##.banner
/ads/*
||Mixed.Case.Example^
||trailing-dot.example.com.^
@@||allowed.example.org^
`;
const parseTexts: [Format, string][] = [
  ["hosts", hosts], ["domains", domains], ["adblock", adblock],
  ["hosts", ""], ["domains", ""], ["adblock", ""],
  ["hosts", "0.0.0.0 a.com\r\n0.0.0.0 b.com\r0.0.0.0 c.com\n"],
  ["domains", "a.com\r\nb.com\rc.com\n\n\n"],
  ["adblock", "||a.com^\r\n||b.com^\r||c.com^"],
  ["hosts", "# only comment\n   \n\t\n"],
  ["hosts", "1.2.3 bad.example.com"], ["hosts", "1.2.3.4.5 bad.example.com"], ["hosts", "::1"],
  ["domains", "*.example.com\nexample.com\n*.example.com"],
  ["adblock", "@@||a.com^\n@@a.com^\n||a.com^ \n || a.com^"],
  ["domains", "#a.com\n!b.com\n c.com"],
];
const R = (action: Rule["action"], kind: Rule["kind"], domain: string): Rule => ({ action, kind, domain });
const suites: { rules: Rule[]; hosts: string[] }[] = [
  {
    rules: [R("block", "subtree", "example.com"), R("allow", "exact", "ok.example.com")],
    hosts: ["example.com", "www.example.com", "a.b.example.com", "ok.example.com", "x.ok.example.com", "example.org",
      "notexample.com", "com", "EXAMPLE.COM.", "", "bad host", "EXAMPLE.com", "e.xample.com"],
  },
  {
    rules: [R("block", "wildcard", "example.com")],
    hosts: ["example.com", "a.example.com", "a.b.example.com", "b.example.com.", "xexample.com"],
  },
  {
    rules: [R("block", "exact", "ads.example.com")],
    hosts: ["ads.example.com", "x.ads.example.com", "example.com", "ads.example.com.", "ADS.EXAMPLE.COM"],
  },
  {
    rules: [R("block", "exact", "a.com"), R("block", "subtree", "a.com"), R("block", "wildcard", "a.com")],
    hosts: ["a.com", "x.a.com", "y.x.a.com", "b.com"],
  },
  {
    rules: [R("block", "subtree", "example.com"), R("allow", "subtree", "example.com")],
    hosts: ["example.com", "w.example.com"],
  },
  {
    rules: [R("block", "subtree", "com"), R("allow", "wildcard", "safe.com"), R("block", "exact", "deep.safe.com")],
    hosts: ["com", "x.com", "safe.com", "a.safe.com", "deep.safe.com", "b.deep.safe.com", "org"],
  },
  {
    rules: [R("allow", "subtree", "a.b.c"), R("block", "subtree", "c"), R("block", "subtree", "b.c")],
    hosts: ["c", "b.c", "a.b.c", "x.a.b.c", "x.c", "q.b.c"],
  },
  {
    rules: [R("block", "subtree", "EXAMPLE.org."), R("block", "subtree", "bad host"), R("block", "exact", ""),
      R("block", "subtree", "example.org")],
    hosts: ["example.org", "sub.example.org"],
  },
  { rules: [], hosts: ["example.com", "", "localhost"] },
  {
    rules: [R("block", "subtree", "_dmarc.example.com"), R("block", "exact", "1.2.3.4")],
    hosts: ["_dmarc.example.com", "x._dmarc.example.com", "1.2.3.4", "9.1.2.3.4", "example.com"],
  },
  {
    rules: [R("block", "subtree", "a".repeat(63) + ".com")],
    hosts: ["a".repeat(63) + ".com", "x." + "a".repeat(63) + ".com", "a".repeat(64) + ".com"],
  },
];

const out = {
  version: 1,
  normalize: norm.map((i) => ({ in: i, out: normalizeHost(i) })),
  parse: parseTexts.map(([format, text]) => ({ format, text, ...parseList(text, format) })),
  match: suites.map((s) => {
    const bl = new Blocklist();
    const adds = s.rules.map((r) => bl.add(r));
    return {
      rules: s.rules,
      adds,
      size: bl.size,
      cases: s.hosts.map((h) => ({ host: h, ...bl.match(h) })),
    };
  }),
};
const n = out.normalize.length + out.parse.length + out.match.reduce((a, s) => a + s.cases.length + s.adds.length, 0);
(out as Record<string, unknown>).caseCount = n;
writeFileSync(new URL("../vectors/lombokblocklist-vectors-v1.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log("cases", n);
