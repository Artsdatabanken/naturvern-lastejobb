const { io } = require("lastejobb");

// Kategorier for kommuner og fylker som naturvernområdet befinner seg geografisk i

let fylker = io.lesDatafil("fylke.json").items;
let kommuner = io.lesDatafil("kommune.json").items;

const tre = [];
lagKoder(tre, fylker, "fylke");
lagKoder(tre, kommuner, "kommune");
tre.push({
  kode: "VV-AO",
  tittel: { nob: "Fastlands-Norge" },
  url: "/Naturvernområde/Fastlands-Norge"
});
io.skrivDatafil("naturvern_i_kommune.json", tre);

function lagKoder(r, kilde, nivå) {
  kilde.forEach(o => {
    if (!o.tittel.nob) throw new Error("Mangler navn.");
    const key = "VV-" + o.kode.replace("-TO-FL", "");
    const e = {
      kode: key,
      tittel: {
        nob: "Naturvernområde i " + o.tittel.nob + " " + nivå,
        url: o.tittel.nob
      }
    };
    r.push(e);
  });
}
