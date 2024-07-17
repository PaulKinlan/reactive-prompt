var f = (t, o, e) => {
  if (!o.has(t))
    throw TypeError("Cannot " + e);
};
var p = (t, o, e) => (f(t, o, "read from private field"), e ? e.call(t) : o.get(t)), m = (t, o, e) => {
  if (o.has(t))
    throw TypeError("Cannot add the same private member more than once");
  o instanceof WeakSet ? o.add(t) : o.set(t, e);
}, u = (t, o, e, s) => (f(t, o, "write to private field"), s ? s.call(t, e) : o.set(t, e), e);
import { signal as b, effect as g } from "@preact/signals-core";
import { P as d, a as T } from "./accumulate-6PdxjI_q.js";
var a, n;
class y extends d {
  constructor() {
    super();
    m(this, a, void 0);
    m(this, n, void 0);
  }
  get temperature() {
    return p(this, a);
  }
  set temperature(e) {
    u(this, a, e);
  }
  get topK() {
    return p(this, n);
  }
  set topK(e) {
    u(this, n, e);
  }
}
a = new WeakMap(), n = new WeakMap();
function x(t, ...o) {
  const e = b(), s = T(t, o, y);
  if (!("model" in globalThis) && !("ai" in globalThis))
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  const l = globalThis.model || globalThis.ai;
  return l.canCreateTextSession().then(async (h) => {
    if (h == "no")
      throw new Error(
        "The 'prompt' API is not available and not able to run in your browser."
      );
    if (h == "after-download")
      throw new Error(
        "The 'prompt' API is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components"
      );
    const c = await l.defaultTextSessionOptions();
    let r;
    for (let i of o)
      i instanceof d && (r = i);
    const w = await l.createTextSession({
      topK: (r == null ? void 0 : r.topK) || c.topK,
      temperature: (r == null ? void 0 : r.temperature) || c.temperature
    });
    g(() => {
      w.prompt(s.value).then((i) => {
        e.value = i;
      });
    });
  }), e;
}
export {
  y as ChromePromptConfiguration,
  x as prompt
};
