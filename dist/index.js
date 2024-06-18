var d = (e, o, t) => {
  if (!o.has(e))
    throw TypeError("Cannot " + t);
};
var m = (e, o, t) => (d(e, o, "read from private field"), t ? t.call(e) : o.get(e)), u = (e, o, t) => {
  if (o.has(e))
    throw TypeError("Cannot add the same private member more than once");
  o instanceof WeakSet ? o.add(e) : o.set(e, t);
}, h = (e, o, t, n) => (d(e, o, "write to private field"), n ? n.call(e, t) : o.set(e, t), t);
import { computed as w } from "@preact/signals-core";
class f {
}
var s, l;
class y extends f {
  constructor() {
    super();
    u(this, s, void 0);
    u(this, l, void 0);
  }
  get temperature() {
    return m(this, s);
  }
  set temperature(t) {
    h(this, s, t);
  }
  get topK() {
    return m(this, l);
  }
  set topK(t) {
    h(this, l, t);
  }
}
s = new WeakMap(), l = new WeakMap();
async function x(e, ...o) {
  if (!("model" in globalThis) && "ai" in globalThis)
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  const t = globalThis.model || globalThis.ai, n = await t.canCreateTextSession(), c = await t.defaultTextSessionOptions();
  if (n == "no")
    throw new Error(
      "The 'prompt' API is not available and not able to run in your browser."
    );
  if (n == "after-download")
    throw new Error(
      "The 'prompt' API is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components"
    );
  let r;
  for (let i of o)
    i instanceof f && (r = i);
  const b = await t.createTextSession({
    topK: (r == null ? void 0 : r.topK) || c.topK,
    temperature: (r == null ? void 0 : r.temperature) || c.temperature
  });
  return w(async () => {
    const i = [e[0]];
    for (let p = 0; p < o.length; p++) {
      let a = o[p];
      "brand" in a && typeof a.brand == "symbol" && Symbol.keyFor(a.brand) === "preact-signals" && (a = a.value), !(a instanceof y) && i.push(await a, e[p + 1]);
    }
    return b.prompt(i.join(""));
  });
}
export {
  y as ChromePromptConfiguration,
  f as PromptConfiguration,
  x as prompt
};
