const { io, json, log } = require("@artsdatabanken/lastejobb");
const moveKey = json.moveKey;

const lesSparqlOutput = fil => io.lesTempJson(fil).results.bindings;
const coordWktToArray = coord => {
  const ll = coord.match(/\((?<lon>.*) (?<lat>.*)\)/).groups;
  return { lengde: parseFloat(ll.lon), bredde: parseFloat(ll.lat) };
};

const forvaltningsmyndighet = lesEnum(
  "naturvern-ubehandlet/forvaltningsmyndighet"
);
const verneform = lesEnum("naturvern-ubehandlet/verneform");
const verneplan = lesEnum("naturvern-ubehandlet/verneplan");
const truetvurdering = lesEnum("naturvern-ubehandlet/truetvurdering");
const iucn = lesEnum("naturvern-ubehandlet/iucn");

function lesEnum(fn) {
  const src = io.lesTempJson(fn);
  const r = {};
  src.forEach(e => (r[e.kodeautor] = e));
  return r;
}

const geonorge = io.lesJsonLines("geonorge_naturvernområde.geojsonl");
const wiki = lesWikidata("wikidata_naturvernområde");
const geo = json.arrayToObject(
  io.lesTempJson("naturvernområde_kart.json"),
  { uniqueKey: "id" }
);

const r = [];
geonorge.forEach(feature => {
  const props = feature.properties;
  const key = props["naturvernId"];
  const e = flett(props, wiki[key])
  if (e)
    r.push(e);
});

r.sort((a, b) => (a.kodeautor > b.kodeautor ? 1 : -1));
io.skrivDatafil("naturvernområde.json", r);

function flett(mdir, wiki) {
  const e = Object.assign({}, mdir, wiki);
  Object.keys(e).forEach(k => {
    if (e[k] === "" || e[k] === null) delete e[k];
  });
  delete e.ident_navnerom;
  delete e.objekttype;
  if (!verneform[e.verneform])
    log.warn("Mangler definisjon verneform: " + e.verneform);
  e.verneform = verneform[e.verneform];
  if (e.verneplan && !verneplan[e.verneplan])
    log.warn("Mangler definisjon verneplan: " + e.verneplan);
  e.verneplan = verneplan[e.verneplan];
  e.forvaltning = {
    ansvarlig: forvaltningsmyndighet[e.forvaltningsmyndighetType]
  };
  if (!forvaltningsmyndighet[e.forvaltningsmyndighetType])
    log.warn(
      "Mangler definisjon forvaltningsmyndighet: " + e.forvaltningsmyndighetType
    );

  e.vurdering = { truet: truetvurdering[e.truetVurdering] };
  if (!truetvurdering[e.truetVurdering])
    log.warn(e.faktaark + " mangler truetvurdering " + e.truetVurdering);
  if (e.iucn) {
    e.vurdering.iucn = iucn[e.iucn];
    if (!iucn[e.iucn]) log.warn(e.faktaark + " mangler iucn " + e.iucn);
  }
  delete e.truetVurdering;
  delete e.forvaltningsmyndighetType;
  delete e.OBJECTID;
  delete e.iucn;
  delete e.cddaId;
  e.geografi = { areal: Math.round(e["SHAPE.STArea()"]) };
  delete e["SHAPE.STArea()"];
  delete e["SHAPE.STLength()"];

  e.tittel = {
    nob: e.navn
  };
  delete e.navn;
  e.verneforskrift = fixBrokenUrlLovdata(e.verneforskrift);

  moveKey(e, "naturvernId", "kodeautor");
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "foto", "mediakilde.foto");
  moveKey(e, "faktaark", "lenke.faktaark");
  moveKey(e, "verneforskrift", "lenke.verneforskrift");
  moveKey(e, "article", "lenke.wikipedia");
  moveKey(e, "item", "lenke.wikidata");
  moveKey(e, "forvaltningsmyndighet", "forvaltning.instans.tittel");
  moveKey(e, "vernnetverk", "vurdering.nettverk");
  moveKey(e, "moblandprioritet", "vurdering.moblandprioritet");
  moveKey(e, "revisjon", "revisjon.status");
  moveKey(e, "vernplanbehov", "revisjon.planbehov");
  //  moveKey(e, "områdeplanstatus_plandato", "revisjon.dato.plandato");
  e.revisjon = e.revisjon || {};
  e.revisjon.dato = e.revisjon.dato || {};
  delete e.itemLabel;
  delete e.naturbase;
  delete e.kommune;
  if (e.verneform) e.foreldre = [e.verneform.kode];
  e.kode = "VV-" + parseInt(e.kodeautor.substring(2));
  if (e.coords) e.coords = coordWktToArray(e.coords);
  if (e.inception) {
    e.revisjon.dato.førstvernet = e.inception;
    delete e.inception;
  }
  moveKey(e, "coords", "geografi.punkt");
  if (e.elevation) e.elevation = parseFloat(e.elevation);
  moveKey(e, "elevation", "geografi.elevasjon");

  if (e.wdpaid) {
    e.lenke.wdpa = "https://www.protectedplanet.net/" + e.wdpaid;
    delete e.wdpaid;
  }

  if (e.vernedato) e.revisjon.dato.vernet = new Date(e.vernedato);
  delete e.vernedato;
  if (e.foerstegangVernet)
    e.revisjon.dato.førstvernet = new Date(e.foerstegangVernet);
  delete e.foerstegangVernet;

  e.mediakilde = e.mediakilde || {};
  e.mediakilde.kart = "thumbnail.png";

  e.geografi = e.geografi || {};
  const geovv = geo[e.kodeautor];
  if (!geovv) {
    log.error("Mangler geografi for " + e.kodeautor);
    return null
  }
  e.geografi.kommune = geovv.kommuner;
  e.geografi.fylke = geovv.fylker;
  //  e.geografi.areal = geovv.areal;
  return e;
}

function lesWikidata(filnavn) {
  const elementer = lesSparqlOutput(filnavn);
  const r = {};
  elementer.forEach(e => {
    const k = map(e);
    if (k.dissolved < new Date()) return;
    if (k.inception > new Date()) return;
    r[k.naturbase] = k;
  });
  return r;
}

function map(e) {
  const r = {};
  Object.entries(e).forEach(([key, v]) => {
    r[key] = value(v);
  });
  return r;
}

function value(e) {
  if (!e) return null;
  if (e.datatype === "http://www.w3.org/2001/XMLSchema#dateTime")
    return new Date(e.value);
  return e.value;
}

//https://lovdata.no/for/lf/mv/xv-19830128-0100.html
//https://lovdata.no/dokument/LF/forskrift/1983-01-28-100

function fixBrokenUrlLovdata(url) {
  if (!url || url.indexOf("for/lf") < 0) return url;
  const parts = url.split("-");
  const num = parts[1];
  const year = num.substring(0, 4);
  const month = num.substring(4, 6);
  const day = num.substring(6, 8);
  const seq = parts[2].replace(".html", "");
  url = `https://lovdata.no/dokument/LF/forskrift/${year}-${month}-${day}-${parseInt(
    seq
  )}`;
  return url;
}
