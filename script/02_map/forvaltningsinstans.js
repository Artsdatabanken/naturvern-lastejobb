const { io } = require("lastejobb");

let fylker = io.lesDatafil("fylke.json").items;
const r = lagFylkesmann(fylker);
io.skrivBuildfil("forvaltningsinstans.json", { items: r });

function lagFylkesmann(kilde) {
  const r = [];
  kilde.forEach(o => {
    if (!o.kode) debugger;
    const e = {
      navn: { nor: "Fylkesmannen i " + o.itemLabel },
      kode: "VV-FM-FM-" + o.kode
    };
    r.push(e);
  });
  return r;
}
