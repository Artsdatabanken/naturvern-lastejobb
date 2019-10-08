const { io, url } = require("lastejobb");

const tre = io.lesDatafil("alle");
new url(tre).assignUrls();
Object.values(tre).forEach(e => {
  if (e.offisieltNavn) {
    e.tittel.nob = e.offisieltNavn;
    delete e.offisieltNavn;
    delete e.verneform;
    delete e.verneplan;
    delete e.vurdering;
  }
});
io.skrivBuildfil(__filename, tre);
