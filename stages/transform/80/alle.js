const { io, json, log } = require("lastejobb");

const antallMedSammeTittel = {};
const antallMedSammeTittelIFylke = {};

const alleFylkerArray = io.lesDatafil("fylke").items;
const alleFylker = {};
alleFylkerArray.forEach(e => (alleFylker[e.kode] = e));

const alleKommunerArray = io.lesDatafil("kommune").items;
const alleKommuner = {};
alleKommunerArray.forEach(e => (alleKommuner[e.kode] = e));

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
  Object.values(tre).forEach(e => {
    if (!e.tittel) return;
    const nøkkel = e.foreldre[0] + ":" + e.tittel.nob;
    const nøkkelfylke =
      e.foreldre[0] + ":" + e.tittel.nob + ":" + e.geografi.fylke[0];
    let antall = antallMedSammeTittel[nøkkel] || 0;
    antallMedSammeTittel[nøkkel] = antall + 1;
    antall = antallMedSammeTittelIFylke[nøkkelfylke] || 0;
    antallMedSammeTittelIFylke[nøkkelfylke] = antall + 1;
  });

  Object.values(tre).forEach(e => {
    if (!e.tittel) return;
    e.tittel.nob = uniktNavn(e);
    delete e.geografi.fylke;
    delete e.geografi.kommune;
  });
}

function uniktNavn(e) {
  let nøkkel = e.foreldre[0] + ":" + e.tittel.nob;
  if (antallMedSammeTittel[nøkkel] <= 1) return e.tittel.nob;
  const fylkekode = e.geografi.fylke[0];
  const fylke = alleFylker["AO-TO-FL-" + fylkekode];
  nøkkel += ":" + fylkekode;
  if (antallMedSammeTittelIFylke[nøkkel] <= 1)
    return e.tittel.nob + " (" + fylke.navn.nob + ")";
  const kommunekode = e.geografi.kommune[0].substring(2);
  const kommune = alleKommuner["AO-TO-FL-" + fylkekode + "-" + kommunekode];
  return e.tittel.nob + " (" + kommune.navn.nob + ")";
}

io.skrivDatafil(__filename, tre);
