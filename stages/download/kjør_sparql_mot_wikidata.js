const wikidata = require("../../wikidata");
const { io, log } = require("lastejobb");
const path = require("path");

const query = "./wikidata_naturvernområde.sparql";
wikidata.queryFromFile(query, path.parse(query).name).catch(err => {
  log.error(err.message);
  process.exit(1);
});
