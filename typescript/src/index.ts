export type Action = "block" | "allow";
export type Kind = "exact" | "subtree" | "wildcard";
export type Format = "hosts" | "domains" | "adblock";
export type Verdict = "block" | "allow" | "none" | "invalid";
export type AddResult = "added" | "duplicate" | "invalid";

export interface Rule {
  action: Action;
  kind: Kind;
  domain: string;
}
export interface ParseResult {
  rules: Rule[];
  skipped: number;
}
export interface MatchResult {
  verdict: Verdict;
  rule: Rule | null;
}

type Slot = { exact?: Rule; wildcard?: Rule; subtree?: Rule };
interface Node {
  kids: Map<string, Node>;
  block: Slot;
  allow: Slot;
}

const LABEL_OK = /^[a-z0-9_]([a-z0-9_-]*[a-z0-9_])?$/;
const IGNORED_HOSTS = new Set([
  "localhost", "localhost.localdomain", "local", "broadcasthost",
  "ip6-localhost", "ip6-loopback", "ip6-localnet", "ip6-mcastprefix",
  "ip6-allnodes", "ip6-allrouters", "ip6-allhosts", "0.0.0.0",
]);
const trimWs = (s: string): string => s.replace(/^[ \t]+|[ \t]+$/g, "");

/** Normalisasi nama host: ASCII saja, huruf kecil, satu titik akhir dibuang. null bila tidak sah. */
export function normalizeHost(input: string): string | null {
  let h = input.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "");
  h = h.replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
  if (h.endsWith(".")) h = h.slice(0, -1);
  if (h.length === 0 || h.length > 253) return null;
  for (const label of h.split(".")) {
    if (label.length === 0 || label.length > 63 || !LABEL_OK.test(label)) return null;
  }
  return h;
}

function mk(action: Action, kind: Kind, host: string): Rule | null {
  const d = normalizeHost(host);
  return d === null ? null : { action, kind, domain: d };
}

export function parseList(text: string, format: Format): ParseResult {
  const rules: Rule[] = [];
  let skipped = 0;
  for (const raw of text.split(/\r\n|\n|\r/)) {
    let line = trimWs(raw);
    if (line === "") continue;
    if (format === "hosts") {
      const c = line.indexOf("#");
      if (c >= 0) line = trimWs(line.slice(0, c));
      if (line === "") continue;
      const tok = line.split(/[ \t]+/);
      const ip = tok[0];
      const ipOk = /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/.test(ip) || (ip.includes(":") && /^[0-9a-fA-F:]+$/.test(ip));
      if (tok.length < 2 || !ipOk) {
        skipped++;
        continue;
      }
      for (const t of tok.slice(1)) {
        const d = normalizeHost(t);
        if (d === null) {
          skipped++;
          continue;
        }
        if (IGNORED_HOSTS.has(d)) continue;
        rules.push({ action: "block", kind: "exact", domain: d });
      }
    } else if (format === "domains") {
      if (line.startsWith("#") || line.startsWith("!")) continue;
      const c = line.indexOf("#");
      if (c >= 0) line = trimWs(line.slice(0, c));
      if (line === "") continue;
      const wild = line.startsWith("*.");
      const r = mk("block", wild ? "wildcard" : "subtree", wild ? line.slice(2) : line);
      if (r) rules.push(r);
      else skipped++;
    } else {
      if (line.startsWith("!") || line.startsWith("[")) continue;
      const allow = line.startsWith("@@");
      const body = allow ? line.slice(2) : line;
      let r: Rule | null = null;
      if (body.startsWith("||") && body.endsWith("^") && body.length > 3) {
        r = mk(allow ? "allow" : "block", "subtree", body.slice(2, -1));
      }
      if (r) rules.push(r);
      else skipped++;
    }
  }
  return { rules, skipped };
}

export class Blocklist {
  private root: Node = { kids: new Map(), block: {}, allow: {} };
  private count = 0;

  get size(): number {
    return this.count;
  }

  add(rule: Rule): AddResult {
    const d = normalizeHost(rule.domain);
    if (d === null) return "invalid";
    let node = this.root;
    for (const l of d.split(".").reverse()) {
      let next = node.kids.get(l);
      if (!next) {
        next = { kids: new Map(), block: {}, allow: {} };
        node.kids.set(l, next);
      }
      node = next;
    }
    const slot = node[rule.action];
    if (slot[rule.kind]) return "duplicate";
    slot[rule.kind] = { action: rule.action, kind: rule.kind, domain: d };
    this.count++;
    return "added";
  }

  load(text: string, format: Format): ParseResult {
    const res = parseList(text, format);
    for (const r of res.rules) this.add(r);
    return res;
  }

  match(host: string): MatchResult {
    const h = normalizeHost(host);
    if (h === null) return { verdict: "invalid", rule: null };
    const labels = h.split(".").reverse();
    const n = labels.length;
    let node = this.root;
    let allow: Rule | null = null;
    let block: Rule | null = null;
    for (let k = 1; k <= n; k++) {
      const next = node.kids.get(labels[k - 1]);
      if (!next) break;
      node = next;
      const pick = (s: Slot): Rule | null =>
        k === n ? (s.exact ?? s.subtree ?? null) : (s.wildcard ?? s.subtree ?? null);
      allow = pick(node.allow) ?? allow;
      block = pick(node.block) ?? block;
    }
    if (allow) return { verdict: "allow", rule: allow };
    if (block) return { verdict: "block", rule: block };
    return { verdict: "none", rule: null };
  }
}
