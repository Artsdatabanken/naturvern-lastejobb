const { io } = require("lastejobb");

// Kategorier for kommuner og fylker som naturvernområdet befinner seg geografisk i

let fylker = io.lesDatafil("fylke.json").items;
let kommuner = io.lesDatafil("kommune.json").items;

const r = [];
lagKoder(r, fylker, "fylke");
lagKoder(r, kommuner, "kommune");
io.skrivBuildfil("kommune.json", r);

function lagKoder(r, kilde, nivå) {
  kilde.forEach(o => {
    if (!o.tittel.nob) throw new Error("Mangler navn.");
    const key = "VV-" + o.kode;
    const e = {
      kode: key,
      tittel: { nob: "Naturvernområde i " + o.tittel.nob + " " + nivå }
    };
    r.push(e);
  });
}
