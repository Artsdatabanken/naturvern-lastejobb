const { io } = require("lastejobb");

let fylker = io.lesDatafil("fylke.json").items;
let kommuner = io.lesDatafil("kommune.json").items;

const r = [];
lagKoder(r, fylker, "fylke");
lagKoder(r, kommuner, "kommune");
io.skrivBuildfil("kommune.json", r);

function lagKoder(r, kilde, nivå) {
  kilde.forEach(o => {
    const key = "VV-" + o.kode;
    const e = {
      kode: key,
      navn: { nob: "Naturvernområde i " + o.navn.nob + " " + nivå }
    };
    r.push(e);
  });
}
