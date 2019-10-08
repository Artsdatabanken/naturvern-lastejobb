const { io, url } = require("lastejobb");

const tre = io.lesDatafil("alle");
new url(tre).assignUrls();
Object.values(tre).forEach(e => {
  if (e.offisieltNavn) {
    e.tittel.nob = e.offisieltNavn;
    delete e.offisieltNavn;
  }
});
io.skrivBuildfil(__filename, tre);
