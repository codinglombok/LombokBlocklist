import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Blocklist, normalizeHost, parseList } from "../src/index.ts";

const v = JSON.parse(readFileSync(new URL("../../vectors/lombokblocklist-vectors-v1.json", import.meta.url), "utf8"));

test("vector count >= 100", () => assert.ok(v.caseCount >= 100));
test("normalize", () => {
  for (const c of v.normalize) assert.equal(normalizeHost(c.in), c.out, JSON.stringify(c.in));
});
test("parse", () => {
  for (const c of v.parse) assert.deepEqual(parseList(c.text, c.format), { rules: c.rules, skipped: c.skipped });
});
test("match", () => {
  for (const s of v.match) {
    const bl = new Blocklist();
    assert.deepEqual(s.rules.map((r: never) => bl.add(r)), s.adds);
    assert.equal(bl.size, s.size);
    for (const c of s.cases) assert.deepEqual(bl.match(c.host), { verdict: c.verdict, rule: c.rule }, c.host);
  }
});
