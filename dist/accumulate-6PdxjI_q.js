import { computed as u } from "@preact/signals-core";
class i {
}
function c(e, a, r) {
  return u(() => {
    const n = [e[0]];
    for (let t = 0; t < a.length; t++) {
      let o = a[t];
      if (typeof o != "string" && "brand" in o && typeof o.brand == "symbol" && Symbol.keyFor(o.brand) === "preact-signals" && (o = o.value), o instanceof r) {
        n.push(e[t + 1]);
        continue;
      }
      n.push(o, e[t + 1]);
    }
    return n.join("");
  });
}
export {
  i as P,
  c as a
};
