const { http, log } = require("lastejobb");
const path = require("path");

// Laster ned verneområder fra Miljødirektoratet via GeoNorge
// Kjører på en tåpelig FME med handlekurv.
// Har ikke kapasitet til å automatisere en email-loop.
// Vi leser manuelt oppdatert proxy-fil.
http
  .downloadBinary(
    "https://data.test.artsdatabanken.no/Naturvernområde/kildedata.4326.geojson",
    `${path.basename(__filename, ".js")}.geojson`
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });
