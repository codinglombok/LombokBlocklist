from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

_LABEL_OK = re.compile(r"[a-z0-9_]([a-z0-9_-]*[a-z0-9_])?")
_IGNORED = frozenset([
    "localhost", "localhost.localdomain", "local", "broadcasthost",
    "ip6-localhost", "ip6-loopback", "ip6-localnet", "ip6-mcastprefix",
    "ip6-allnodes", "ip6-allrouters", "ip6-allhosts", "0.0.0.0",
])
_V4 = re.compile(r"[0-9]{1,3}(\.[0-9]{1,3}){3}")
_V6 = re.compile(r"[0-9a-fA-F:]+")
_WS = " \t"


@dataclass(frozen=True)
class Rule:
    action: str
    kind: str
    domain: str


def normalize_host(text: str) -> Optional[str]:
    h = text.strip(" \t\r\n")
    h = "".join(chr(ord(c) + 32) if "A" <= c <= "Z" else c for c in h)
    if h.endswith("."):
        h = h[:-1]
    if not h or len(h) > 253:
        return None
    for label in h.split("."):
        if not label or len(label) > 63 or _LABEL_OK.fullmatch(label) is None:
            return None
    return h


def _mk(action: str, kind: str, host: str) -> Optional[Rule]:
    d = normalize_host(host)
    return None if d is None else Rule(action, kind, d)


def parse_list(text: str, fmt: str) -> tuple[list[Rule], int]:
    rules: list[Rule] = []
    skipped = 0
    for raw in re.split(r"\r\n|\n|\r", text):
        line = raw.strip(_WS)
        if line == "":
            continue
        if fmt == "hosts":
            c = line.find("#")
            if c >= 0:
                line = line[:c].strip(_WS)
            if line == "":
                continue
            tok = re.split(r"[ \t]+", line)
            ip = tok[0]
            ip_ok = _V4.fullmatch(ip) is not None or (":" in ip and _V6.fullmatch(ip) is not None)
            if len(tok) < 2 or not ip_ok:
                skipped += 1
                continue
            for t in tok[1:]:
                d = normalize_host(t)
                if d is None:
                    skipped += 1
                    continue
                if d in _IGNORED:
                    continue
                rules.append(Rule("block", "exact", d))
        elif fmt == "domains":
            if line.startswith("#") or line.startswith("!"):
                continue
            c = line.find("#")
            if c >= 0:
                line = line[:c].strip(_WS)
            if line == "":
                continue
            wild = line.startswith("*.")
            r = _mk("block", "wildcard" if wild else "subtree", line[2:] if wild else line)
            if r:
                rules.append(r)
            else:
                skipped += 1
        else:
            if line.startswith("!") or line.startswith("["):
                continue
            allow = line.startswith("@@")
            body = line[2:] if allow else line
            r = None
            if body.startswith("||") and body.endswith("^") and len(body) > 3:
                r = _mk("allow" if allow else "block", "subtree", body[2:-1])
            if r:
                rules.append(r)
            else:
                skipped += 1
    return rules, skipped


class _Node:
    __slots__ = ("kids", "block", "allow")

    def __init__(self) -> None:
        self.kids: dict[str, _Node] = {}
        self.block: dict[str, Rule] = {}
        self.allow: dict[str, Rule] = {}


class Blocklist:
    def __init__(self) -> None:
        self._root = _Node()
        self._count = 0

    @property
    def size(self) -> int:
        return self._count

    def add(self, rule: Rule) -> str:
        d = normalize_host(rule.domain)
        if d is None:
            return "invalid"
        node = self._root
        for l in reversed(d.split(".")):
            node = node.kids.setdefault(l, _Node())
        slot = node.block if rule.action == "block" else node.allow
        if rule.kind in slot:
            return "duplicate"
        slot[rule.kind] = Rule(rule.action, rule.kind, d)
        self._count += 1
        return "added"

    def load(self, text: str, fmt: str) -> tuple[list[Rule], int]:
        rules, skipped = parse_list(text, fmt)
        for r in rules:
            self.add(r)
        return rules, skipped

    def match(self, host: str) -> tuple[str, Optional[Rule]]:
        h = normalize_host(host)
        if h is None:
            return "invalid", None
        labels = list(reversed(h.split(".")))
        n = len(labels)
        node = self._root
        allow = block = None
        for k in range(1, n + 1):
            nxt = node.kids.get(labels[k - 1])
            if nxt is None:
                break
            node = nxt

            def pick(s: dict[str, Rule]) -> Optional[Rule]:
                if k == n:
                    return s.get("exact") or s.get("subtree")
                return s.get("wildcard") or s.get("subtree")

            allow = pick(node.allow) or allow
            block = pick(node.block) or block
        if allow:
            return "allow", allow
        if block:
            return "block", block
        return "none", None
