const { io, log } = require("lastejobb");

const lesSparqlOutput = fil => io.lesDatafil(fil).results.bindings;

const r = lesElementer(__filename, "naturbase");
io.skrivBuildfil(__filename, sortByKey(r));

function sortByKey(o) {
  return Object.keys(o)
    .sort()
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: o[key]
      }),
      {}
    );
}

function lesElementer(filnavn, nøkkelfelt) {
  const elementer = lesSparqlOutput(filnavn);
  const r = {};
  elementer.forEach(e => {
    const k = map(e);
    if (k.dissolved < new Date()) return;
    if (k.inception > new Date()) return;
    const nøkkel = k[nøkkelfelt];
    r[nøkkel] = k;
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

function add(o, key, field) {
  if (!field) return;
  let value = field.value;
  if (field.datatype === "http://www.w3.org/2001/XMLSchema#dateTime")
    value = new Date(value);
  if (value) o[key] = value;
}

function value(e) {
  if (!e) return null;
  return e.value;
}
