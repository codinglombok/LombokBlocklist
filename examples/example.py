import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "python" / "src"))
from lombokblocklist import Blocklist

bl = Blocklist()
bl.load("0.0.0.0 ads.example.com\n", "hosts")
bl.load("||tracker.example.net^\n@@||ok.tracker.example.net^\n", "adblock")
for h in ["ads.example.com", "x.tracker.example.net", "ok.tracker.example.net", "example.org"]:
    print(h, bl.match(h)[0])
