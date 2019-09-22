const { io } = require("lastejobb");

const r = [];
include("data/relasjon.json");

function include(fn) {
  let rot = io.readJson(fn);
  rot.items.forEach(e => {
    r.push(e);
    if (e.definisjon) include("./data/naturvern-ubehandlet/" + e.definisjon);
  });
}

/*const forvaltningsinstans = io.lesBuildfil("forvaltningsinstans").items;
forvaltningsinstans.forEach(fi => r.push(fi));
const kommune = io.lesBuildfil("kommune").items;
kommune.forEach(ko => r.push(ko));*/
io.skrivBuildfil(__filename, r);
