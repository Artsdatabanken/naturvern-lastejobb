const { io, url } = require("@artsdatabanken/lastejobb");

const tre = io.lesTempJson("alle");
new url(tre).assignUrls();
Object.values(tre).forEach(e => {
  if (e.offisieltNavn) {
    e.tittel.nob = e.offisieltNavn;
    delete e.offisieltNavn;
  }

  // Ligger som relasjoner
  delete e.verneform;
  delete e.verneplan;
  delete e.vurdering;
  delete e.forvaltning;
});
io.skrivBuildfil(__filename, tre);
