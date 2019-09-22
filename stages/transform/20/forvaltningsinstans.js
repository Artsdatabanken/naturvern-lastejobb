const { io } = require("lastejobb");

// Kategorier for forvaltningsinstanser i de forskjellige fylker

let fylker = io.lesDatafil("fylke.json").items;
const r = lagFylkesmann(fylker);
io.skrivBuildfil("forvaltningsinstans.json", r);

function lagFylkesmann(kilde) {
  const r = [];
  kilde.forEach(o => {
    const e = {
      tittel: { nob: "Fylkesmannen i " + o.navn.nob },
      kode: "VV-FM-" + o.kode.replace("AO", "FM")
    };
    r.push(e);
  });
  return r;
}
