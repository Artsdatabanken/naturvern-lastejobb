const { io } = require("lastejobb");

// Kategorier for forvaltningsinstanser i de forskjellige fylker

let fylker = io.lesTempJson("fylke.json");
const r = lagFylkesmann(fylker);
io.skrivDatafil("forvaltningsinstans.json", r);

function lagFylkesmann(kilde) {
  const r = [];
  kilde.forEach(o => {
    const e = {
      tittel: { nob: "Fylkesmannen i " + o.tittel.nob, url: o.tittel.nob },
      kode: "VV-FM-" + o.kode.replace("AO-TO-FL", "FM")
    };
    r.push(e);
  });
  return r;
}
