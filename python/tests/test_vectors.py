import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
from lombokblocklist import Blocklist, Rule, normalize_host, parse_list  # noqa: E402

V = json.loads((pathlib.Path(__file__).resolve().parents[2] / "vectors" / "lombokblocklist-vectors-v1.json").read_text("utf-8"))


def rd(r):
    return None if r is None else Rule(r["action"], r["kind"], r["domain"])


def test_count():
    assert V["caseCount"] >= 100


def test_normalize():
    for c in V["normalize"]:
        assert normalize_host(c["in"]) == c["out"], c["in"]


def test_parse():
    for c in V["parse"]:
        rules, skipped = parse_list(c["text"], c["format"])
        assert rules == [rd(r) for r in c["rules"]] and skipped == c["skipped"], c


def test_match():
    for s in V["match"]:
        bl = Blocklist()
        assert [bl.add(rd(r)) for r in s["rules"]] == s["adds"]
        assert bl.size == s["size"]
        for c in s["cases"]:
            verdict, rule = bl.match(c["host"])
            assert (verdict, rule) == (c["verdict"], rd(c["rule"])), c["host"]
