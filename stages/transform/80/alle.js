const { io, json } = require("lastejobb");

const antallMedSammeTittel = {};
const antallMedSammeTittelIFylke = {};

const alleFylkerArray = io.lesDatafil("fylke").items;
const alleFylker = json.arrayToObject(alleFylkerArray, { uniqueKey: "kode" });

const alleKommunerArray = io.lesDatafil("kommune").items;
const alleKommuner = json.arrayToObject(alleKommunerArray, {
  uniqueKey: "kode"
});

const tre = {};
include("data/relasjon.json");

unngåDuplikatTittel();
let verneformArray = io.readJson("data/naturvern-ubehandlet/verneform.json")
  .items;
const verneform = json.arrayToObject(verneformArray, {
  uniqueKey: "kode"
});
Object.keys(verneform).forEach(key => {
  const e = verneform[key];
  e.foreldre = [
    key
      .split("-")
      .slice(0, -1)
      .join("-")
  ];
  tre[key] = e;
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
