const { io, log } = require("lastejobb");
const verneform = require("./verneform");
const verneplan = require("./verneplan");

const lesSparqlOutput = fil => io.lesDatafil(fil).items.results.bindings;
const parseInvalidDate = s =>
  new Date(
    s.substring(0, 4) + "-" + s.substring(4, 6) + "-" + s.substring(6, 8)
  );

const geonorge = io.lesDatafil("geonorge_naturvernområde", ".geojson");
const wiki = io.lesDatafil("wikidata_naturvernområde").items;

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
  e.verneform = { kode: e.verneform, ...verneform[e.verneform] };
  e.verneplan = { indeks: e.vern_verneplan, ...verneplan[e.vern_verneplan] };

  if (!verneplan[e.vern_verneplan]) {
    // Se https://github.com/Artsdatabanken/naturvern-lastejobb/issues/2
    log.warn(
      e.ident_lokalid + " mangler verneplan (skal antagelig være kvartær.."
    );
    debugger;
  }
  delete e.vern_verneplan;
  moveKey(e, "offisieltnavn", "navn.offisielt");
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "faktaark", "lenke.faktaark");
  moveKey(e, "verneforskrift", "lenke.verneforskrift");
  moveKey(e, "article", "lenke.wikipedia");
  moveKey(e, "item", "lenke.wikidata");
  moveKey(e, "forv_mynd", "forvaltning.myndighet");
  moveKey(e, "forvaltningsmyndighettype", "forvaltning.myndighettype");
  moveKey(e, "truetvurdering", "vurdering.truet");
  moveKey(e, "iucn", "vurdering.iucn");
  moveKey(e, "vernnetverk", "vurdering.nettverk");
  moveKey(e, "moblandprioritet", "vurdering.moblandprioritet");
  moveKey(e, "vernrevisjon", "revisjon.status");
  moveKey(e, "vernplanbehov", "revisjon.planbehov");
  moveKey(e, "områdeplanstatus_plandato", "revisjon.plandato");
  if (!wiki) return e;
  if (e.offisieltnavn !== e.itemLabel && e.navn + " " + e.vern)
    log.warn(`${e.ident_lokalid}: ${e.offisieltnavn} <> ${e.itemLabel}`);
  delete e.itemLabel;
  delete e.naturbase;

  if (e.inception) {
    const was = e.inception;
    if (!new Date((e.inception + "0000").substring(0, 8)))
      throw new Error(e.inception, e.vernedato);
    e.inception = new Date((e.inception + "0000").substring(0, 8));
  }
  moveKey(e, "inception", "revisjon.dato.førstvernet");
  e.vernedato = parseInvalidDate(e.vernedato);
  moveKey(e, "vernedato", "revisjon.dato.vernet");
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
