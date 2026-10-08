import { Blocklist } from "../typescript/src/index.ts";

const bl = new Blocklist();
bl.load("0.0.0.0 ads.example.com\n", "hosts");
bl.load("||tracker.example.net^\n@@||ok.tracker.example.net^\n", "adblock");
for (const h of ["ads.example.com", "x.tracker.example.net", "ok.tracker.example.net", "example.org"]) {
  console.log(h, bl.match(h).verdict);
}
