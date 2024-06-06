import { computed as l } from "@preact/signals-core";
function s(n, ...r) {
  if (!("model" in globalThis))
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  const a = model.createTextSession();
  return l(async () => {
    const t = [n[0]];
    for (let e = 0; e < r.length; e++) {
      let o = r[e];
      "brand" in o && typeof o.brand == "symbol" && Symbol.keyFor(o.brand) === "preact-signals" && (o = o.value), t.push(await o, n[e + 1]);
    }
    return a.then((e) => e.prompt(t.join("")));
  });
}
export {
  s as prompt
};
