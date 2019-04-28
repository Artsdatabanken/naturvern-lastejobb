const { http, log } = require("lastejobb");
const path = require("path");

http
  .downloadBinary(
    "https://github.com/Artsdatabanken/kommune-kart/blob/master/kommune.geojson",
    `kommune.geojson`
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });
