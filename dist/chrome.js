var c = (e, t, o) => {
  if (!t.has(e))
    throw TypeError("Cannot " + o);
};
var m = (e, t, o) => (c(e, t, "read from private field"), o ? o.call(e) : t.get(e)), u = (e, t, o) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, o);
}, h = (e, t, o, i) => (c(e, t, "write to private field"), i ? i.call(e, o) : t.set(e, o), o);
import { computed as w } from "@preact/signals-core";
import { P as d } from "./configuration-W3kPAhYs.js";
var l, p;
class y extends d {
  constructor() {
    super();
    u(this, l, void 0);
    u(this, p, void 0);
  }
  get temperature() {
    return m(this, l);
  }
  set temperature(o) {
    h(this, l, o);
  }
  get topK() {
    return m(this, p);
  }
  set topK(o) {
    h(this, p, o);
  }
}
l = new WeakMap(), p = new WeakMap();
async function x(e, ...t) {
  if (!("model" in globalThis) && "ai" in globalThis)
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  const o = globalThis.model || globalThis.ai, i = await o.canCreateTextSession(), f = await o.defaultTextSessionOptions();
  if (i == "no")
    throw new Error(
      "The 'prompt' API is not available and not able to run in your browser."
    );
  if (i == "after-download")
    throw new Error(
      "The 'prompt' API is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components"
    );
  let r;
  for (let n of t)
    n instanceof d && (r = n);
  const b = await o.createTextSession({
    topK: (r == null ? void 0 : r.topK) || f.topK,
    temperature: (r == null ? void 0 : r.temperature) || f.temperature
  });
  return w(async () => {
    const n = [e[0]];
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if ("brand" in a && typeof a.brand == "symbol" && Symbol.keyFor(a.brand) === "preact-signals" && (a = a.value), a instanceof y) {
        n.push(e[s + 1]);
        continue;
      }
      n.push(await a, e[s + 1]);
    }
    return b.prompt(n.join(""));
  });
}
export {
  y as ChromePromptConfiguration,
  x as prompt
};
