process.env.DEBUG = "*";
const { io, log } = require("lastejobb");

const arrayToObject = (arr, key) =>
  arr.reduce((acc, e) => {
    acc[e[key]] = e;
    return acc;
  }, {});

const lesSparqlOutput = fil => io.lesDatafil(fil).items.results.bindings;
const parseInvalidDate = s =>
  new Date(
    s.substring(0, 4) + "-" + s.substring(4, 6) + "-" + s.substring(6, 8)
  );
const coordWktToArray = coord => {
  const ll = coord.match(/\((?<lon>.*) (?<lat>.*)\)/).groups;
  return { longitude: parseFloat(ll.lon), latitude: parseFloat(ll.lat) };
};

const forvaltningsmyndighet = arrayToObject(
  require("../../naturvern-data/forvaltningsmyndighet").items,
  "kodefremmed"
);
const verneform = arrayToObject(
  require("../../naturvern-data/verneform").items,
  "kode"
);
const verneplan = arrayToObject(
  require("../../naturvern-data/verneplan").items,
  "tallkode"
);

const geonorge = io.lesDatafil("geonorge_naturvernområde", ".geojson");
const wiki = lesWikidata("wikidata_naturvernområde");
const include = {
  Naturvernområde: true
};

const r = [];
const unikeområder = {};
geonorge.features.forEach(feature => {
  const props = feature.properties;
  if (!include[props.objekttype]) return;
  const key = props["ident_lokalid"];
  unikeområder[key] = props;
});
Object.values(unikeområder).forEach(props => {
  const key = props["ident_lokalid"];
  r.push(flett(props, wiki[key]));
});

r.sort((a, b) => (a.ident_lokalid > b.ident_lokalid ? 1 : -1));
const dok = {
  items: r,
  meta: {
    url: `https://github.com/Artsdatabanken/naturvern-data/blob/master/naturvernområde.json`
  }
};
io.skrivBuildfil(__filename, dok);

function flett(mdir, wiki) {
  const e = Object.assign({}, mdir, wiki);
  Object.keys(e).forEach(k => {
    if (e[k] === "" || e[k] === null) delete e[k];
  });
  delete e.ident_navnerom;
  delete e.objekttype;
  e.navn = { navn: e.navn };
  e.verneform = verneform[e.verneform];
  e.verneplan = verneplan[e.vern_verneplan];
  e.forvaltning = forvaltningsmyndighet[e.forvaltningsmyndighettype];

  if (!forvaltningsmyndighet[e.forvaltningsmyndighettype])
    log.warn(
      e.faktaark +
        " mangler forvaltningsmyndighettype " +
        e.forvaltningsmyndighettype
    );
  if (!verneplan[e.vern_verneplan]) {
    // Se https://github.com/Artsdatabanken/naturvern-lastejobb/issues/2
    log.warn(e.faktaark + " mangler verneplan (skal antagelig være kvartær..");
  }
  delete e.vern_verneplan;
  moveKey(e, "offisieltnavn", "navn.offisielt");
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "faktaark", "lenke.faktaark");
  moveKey(e, "verneforskrift", "lenke.verneforskrift");
  moveKey(e, "article", "lenke.wikipedia");
  moveKey(e, "item", "lenke.wikidata");
  moveKey(e, "forv_mynd", "forvaltning.myndighet");
  moveKey(e, "truetvurdering", "vurdering.truet");
  moveKey(e, "iucn", "vurdering.iucn");
  moveKey(e, "vernnetverk", "vurdering.nettverk");
  moveKey(e, "moblandprioritet", "vurdering.moblandprioritet");
  moveKey(e, "vernrevisjon", "revisjon.status");
  moveKey(e, "vernplanbehov", "revisjon.planbehov");
  moveKey(e, "områdeplanstatus_plandato", "revisjon.dato.plandato");
  delete e.itemLabel;
  delete e.naturbase;

  if (e.coords) e.coords = coordWktToArray(e.coords);
  if (e.inception) {
    e.revisjon.dato.førstvernet = e.inception;
    delete e.inception;
  }
  moveKey(e, "coords", "geografi.senter");
  if (e.vernedato) e.revisjon.dato.vernet = parseInvalidDate(e.vernedato);
  delete e.vernedato;
  return e;
}

function moveKey(o, src, destPath) {
  if (!o[src]) return;
  let node = o;
  const destArr = destPath.split(".");
  while (destArr.length > 1) {
    const dest = destArr.shift();
    if (!node[dest]) node[dest] = {};
    node = node[dest];
  }

  const dest = destArr.pop();
  node[dest] = o[src];
  delete o[src];
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
