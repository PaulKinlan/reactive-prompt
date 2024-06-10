import { computed as s } from "@preact/signals-core";
async function p(a, ...r) {
  if (!("model" in globalThis) && "ai" in globalThis)
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  const n = globalThis.model || globalThis.ai, t = await n.canCreateTextSession();
  if (t == "no")
    throw new Error(
      "The 'prompt' API is not available and not able to run in your browser."
    );
  if (t == "after-download")
    throw new Error(
      "The 'prompt' API is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components"
    );
  const l = await n.createTextSession();
  return s(async () => {
    const i = [a[0]];
    for (let e = 0; e < r.length; e++) {
      let o = r[e];
      "brand" in o && typeof o.brand == "symbol" && Symbol.keyFor(o.brand) === "preact-signals" && (o = o.value), i.push(await o, a[e + 1]);
    }
    return l.prompt(i.join(""));
  });
}
export {
  p as prompt
};
