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

include("data/naturvern-ubehandlet/iucn.json");
include("data/naturvern-ubehandlet/verneform.json");
include("data/naturvern-ubehandlet/verneplan.json");
include("data/naturvern-ubehandlet/forvaltningsmyndighet.json");
include("data/naturvern-ubehandlet/truetvurdering.json");
include("data/naturvern_i_kommune.json");

include("data/naturvern-ubehandlet/type.json");

Object.keys(tre).forEach(key => {
  const e = tre[key];
  delete e.kode;
  e.foreldre = e.foreldre || [
    key
      .split("-")
      .slice(0, -1)
      .join("-")
  ];
  tre[key] = e;
});
io.skrivDatafil(__filename, tre);

function include(fn) {
  let rot = io.readJson(fn);
  if (rot.items) rot = json.arrayToObject(rot.items, { uniqueKey: "kode" });
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
    return e.tittel.nob + " (" + fylke.tittel.nob + ")";
  const kommunekode = e.geografi.kommune[0].substring(2);
  const kommune = alleKommuner["AO-TO-FL-" + fylkekode + "-" + kommunekode];
  return e.tittel.nob + " (" + kommune.tittel.nob + ")";
}
