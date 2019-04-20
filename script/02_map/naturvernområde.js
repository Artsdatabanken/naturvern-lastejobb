const { io, log } = require("lastejobb");

const lesSparqlOutput = fil => io.lesDatafil(fil).items.results.bindings;

const r = lesElementer(__filename, "naturbase");
r.sort((a, b) => (a.naturbase > b.naturbase ? 1 : -1));
const dok = {
  items: r,
  meta: {
    url: `https://github.com/Artsdatabanken/naturvern-data/blob/master/naturvernområde.json`
  }
};
io.skrivBuildfil(__filename, dok);

function lesElementer(filnavn) {
  const elementer = lesSparqlOutput(filnavn);
  const r = [];
  elementer.forEach(e => {
    const k = map(e);
    if (k.dissolved < new Date()) return;
    if (k.inception > new Date()) return;
    r.push(k);
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
