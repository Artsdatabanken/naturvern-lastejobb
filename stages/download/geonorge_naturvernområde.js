const { http, log } = require("lastejobb");
const path = require("path");

// Laster ned verneområder fra naturvern-kart-lastejobb
http
  .downloadBinary(
    "https://data.test.artsdatabanken.no/Naturvernområde/kildedata.4326.geojsonl",
    `${path.basename(__filename, ".js")}.geojsonl`
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });
