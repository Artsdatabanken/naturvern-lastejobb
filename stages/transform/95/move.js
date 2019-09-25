const { io, json } = require("lastejobb");

const ny = json.arrayToObject(io.lesBuildfil("type").items, {
  uniqueKey: "kode"
});
const gammel = json.arrayToObject(io.lesBuildfil("type_").items, {
  uniqueKey: "kode"
});
Object.keys(ny).forEach(kode => {
  const o = gammel[kode];
  const n = ny[kode];
  if (!o || !o.url) return;
  if (o.url === n.url) return;
  console.log(`mv "${o.url.substring(1)}" "${n.url.substring(1)}"`);
});
