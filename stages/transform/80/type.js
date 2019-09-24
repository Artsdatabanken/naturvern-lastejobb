const { io, json, log } = require("lastejobb");

const alleFylker = json.arrayToObject(io.lesDatafil("fylke").items, {
  uniqueKey: "kode",
  removeKeyProperty: false
});

const r = [];
include("data/relasjon.json");
include("data/naturvern-ubehandlet/verneform.json");

function include(fn) {
  let rot = io.readJson(fn);
  rot.items.forEach(e => r.push(e));
}

const antallMedSammeTittel = {};
r.forEach(e => {
  if (!e.tittel) return;
  let antall = antallMedSammeTittel[e.tittel.nob] || 0;
  antall++;
  antallMedSammeTittel[e.tittel.nob] = antall;
});

r.forEach(e => {
  if (!e.tittel) return;
  if (antallMedSammeTittel[e.tittel.nob] > 1) {
    log.warn(e.tittel.nob);
    const fylkekode = "AO-TO-FL-" + e.geografi.fylke[0];
    const fylke = alleFylker[fylkekode];
    e.tittel.nob += " (" + fylke.navn.nob + ")";
    if (e.geografi.fylke.length > 1) {
      log.error("###");
    }
  }
  delete e.geografi.fylke;
});

io.skrivBuildfil(__filename, r);
