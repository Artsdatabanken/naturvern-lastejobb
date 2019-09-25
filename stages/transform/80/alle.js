const { io, json, log } = require("lastejobb");

const alleFylkerArray = io.lesDatafil("fylke").items;
const alleFylker = {};
alleFylkerArray.forEach(e => (alleFylker[e.kode] = e));

const tre = {};
include("data/relasjon.json");

unngåDuplikatTittel();
let verneform = io.readJson("data/naturvern-ubehandlet/verneform.json");
verneform.items.forEach(e => {
  e.foreldre = ["VV"];
  tre[e.kode] = e;
});

include("data/naturvern-ubehandlet/type.json");

function include(fn) {
  let rot = io.readJson(fn);
  Object.keys(rot).forEach(
    kode => (tre[kode] = json.mergeDeep({}, rot[kode], tre[kode] || {}))
  );
}

function unngåDuplikatTittel() {
  const antallMedSammeTittel = {};
  Object.values(tre).forEach(e => {
    if (!e.tittel) return;
    let antall = antallMedSammeTittel[e.tittel.nob] || 0;
    antall++;
    antallMedSammeTittel[e.tittel.nob] = antall;
  });

  Object.values(tre).forEach(e => {
    if (!e.tittel) return;
    if (antallMedSammeTittel[e.tittel.nob] > 1) {
      const fylkekode = e.geografi.fylke[0];
      const fylke = alleFylker["AO-TO-FL-" + fylkekode];
      e.tittel.nob += " (" + fylke.navn.nob + ")";
      if (e.geografi.fylke.length > 1) {
        log.error("###");
      }
    }
    delete e.geografi.fylke;
  });
}

io.skrivDatafil(__filename, tre);
