const { io } = require("lastejobb");

const r = [];
include("data/relasjon.json");

function include(fn) {
  let rot = io.readJson(fn);
  rot.items.forEach(e => {
    r.push(e);
    if (e.definisjon) include("./build/" + e.definisjon);
  });
}

io.skrivBuildfil(__filename, r);
