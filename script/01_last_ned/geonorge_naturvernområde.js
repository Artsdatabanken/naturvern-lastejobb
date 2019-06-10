const { http, log } = require("lastejobb");
const path = require("path");

// Laster ned verneområder fra Miljødirektoratet via GeoNorge
// Kjører på en tåpelig FME med handlekurv.
// Har ikke kapasitet til å automatisere en email-loop.
// Vi leser manuelt oppdatert proxy-fil.
http
  .downloadBinary(
    "https://data.artsdatabanken.no/Naturvernomr%C3%A5de/Geonorge_Naturvernomr%C3%A5der_4326.geojson",
    `./data/${path.basename(__filename, ".js")}.geojson`
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });
