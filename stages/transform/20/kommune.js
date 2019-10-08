const { io } = require("lastejobb");

// Kategorier for kommuner og fylker som naturvernområdet befinner seg geografisk i

let fylker = io.lesDatafil("fylke.json").items;
let kommuner = io.lesDatafil("kommune.json").items;

const tre = [];
lagKoder(tre, fylker, "fylke");
lagKoder(tre, kommuner, "kommune");
tre.push({
  kode: "VV-AO-TO-FL",
  tittel: { nob: "Fastlands-Norge" },
  url: "Naturvernområde/Administrativ_grense/Territorialområde/Fastlands-Norge"
});
io.skrivDatafil("naturvern_i_kommune.json", tre);

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
