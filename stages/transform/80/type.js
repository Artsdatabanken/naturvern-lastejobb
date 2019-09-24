const { io } = require("lastejobb");

const r = [];
include("data/relasjon.json");
include("data/naturvern-ubehandlet/verneform.json");

function include(fn) {
  let rot = io.readJson(fn);
  rot.items.forEach(e => r.push(e));
}

io.skrivBuildfil(__filename, r);
