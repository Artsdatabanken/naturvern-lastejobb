const { io } = require("lastejobb");

let fylker = io.lesDatafil("fylke.json").items;
const r = lagFylkesmann(fylker);
io.skrivBuildfil("forvaltningsinstans.json", { items: r });

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
