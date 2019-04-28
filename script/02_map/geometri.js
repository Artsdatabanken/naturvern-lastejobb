const { io, log } = require("lastejobb");
const geonorge = io.lesDatafil("geonorge_naturvernområde", ".geojson");

let vo = io.lesDatafil("geonorge_naturvernområde.geojson");
const areas = geonorge.features.reduce((acc, e) => {
  acc[e.properties.ident_lokalid] = e;
  return acc;
}, {});

var PolygonLookup = require("polygon-lookup");

let kommuner = io.lesDatafil("kommune.geojson");

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

vo.features.forEach(v => {
  const kommuner = finnOverlappendeKommuner(v.geometry);
  if (kommuner.length <= 0) manglerKommune.push(v.properties.ident_lokalid);
});

const total = Object.keys(vo).length;
if (treff < total)
  log.info(`${total - treff} områder ligger utenfor alle kommuner`);

io.skrivDatafil(__filename, vo);
