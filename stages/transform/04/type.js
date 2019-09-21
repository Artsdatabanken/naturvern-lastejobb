const { io } = require("lastejobb");

const r = [];
include("naturvernområde.json");

function include(fn) {
  if (!fn) return;
  let rot = io.readJson("./build/" + fn);
  rot.items.forEach(e => {
    r.push(e);
    include(e.definisjon);
  });
}

io.skrivBuildfil(__filename, r);
