import { computed as l } from "@preact/signals-core";
function s(o, ...n) {
  const a = model.createTextSession();
  return l(async () => {
    const r = [o[0]];
    for (let e = 0; e < n.length; e++) {
      let t = n[e];
      "brand" in t && typeof t.brand == "symbol" && Symbol.keyFor(t.brand) === "preact-signals" && (t = t.value), r.push(await t, o[e + 1]);
    }
    return a.then((e) => e.prompt(r.join("")));
  });
}
export {
  s as prompt
};
