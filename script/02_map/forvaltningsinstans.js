const { io } = require("lastejobb");

let fylker = io.lesDatafil("fylke.json").items;
const r = lagFylkesmann(fylker);
io.skrivBuildfil("forvaltningsinstans.json", { items: r });

function lagFylkesmann(kilde) {
  const r = [];
  kilde.forEach(o => {
    const e = {
      navn: { nor: "Fylkesmannen i " + o.itemLabel },
      kode: "VV-FM-FM-" + o.code.replace("NO-", "")
    };
    r.push(e);
  });
  return r;
}
