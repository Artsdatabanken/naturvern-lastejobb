const { io, log } = require("lastejobb");
const geonorge = io.lesDatafil("geonorge_naturvernområde", ".geojson");

let vo = io.lesDatafil("naturvern-geometri", ".geojson");
const areas = geonorge.features.reduce((acc, e) => {
  acc[e.properties.ident_lokalid] = e;
  kartverket_kommune;
  return acc;
}, {});

var PolygonLookup = require("polygon-lookup");

let basisdata = io.lesDatafil("kommune.geojson");
const kommuner = basisdata["administrative_enheter.kommune"];

var lookup = new PolygonLookup(kommuner);

let treff = 0;
manglerKommune = [];

function finnOverlappendeKommuner(geometry) {
  let nater = geometry.coordinates;
  while (Array.isArray(nater[0][0])) nater = nater[0];

  let hits = {};
  for (var i = 0; i < nater.length; i++) {
    const punkt = nater[i];
    var poly = lookup.search(punkt[0], punkt[1]);
    if (poly) {
      const kommunenummer = poly.properties.kommunenummer;
      hits[kommunenummer] = 1;
      treff++;
    }
  }
  return Object.keys(hits);
}

Object.keys(vo).forEach(iid => {
  const v = vo[iid];
  const kommuner = finnOverlappendeKommuner(v.geometry);
  if (kommuner.length <= 0) manglerKommune.push(vo.properties.OMRADENAVN);
});

const total = Object.keys(vo).length;
if (treff < total)
  log.info(`${total - treff} områder ligger utenfor alle kommuner`);

io.skrivDatafil(__filename, vo);
