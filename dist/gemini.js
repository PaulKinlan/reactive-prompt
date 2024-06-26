var h = (t, o, e) => {
  if (!o.has(t))
    throw TypeError("Cannot " + e);
};
var r = (t, o, e) => (h(t, o, "read from private field"), e ? e.call(t) : o.get(t)), i = (t, o, e) => {
  if (o.has(t))
    throw TypeError("Cannot add the same private member more than once");
  o instanceof WeakSet ? o.add(t) : o.set(t, e);
}, s = (t, o, e, g) => (h(t, o, "write to private field"), g ? g.call(t, e) : o.set(t, e), e);
import { computed as w } from "@preact/signals-core";
import { GoogleGenerativeAI as v } from "@google/generative-ai";
import { P as y } from "./configuration-W3kPAhYs.js";
var l, m, p, f, d, c;
class x extends y {
  constructor() {
    super();
    i(this, l, void 0);
    i(this, m, void 0);
    i(this, p, void 0);
    i(this, f, void 0);
    i(this, d, void 0);
    i(this, c, void 0);
  }
  get key() {
    return r(this, d);
  }
  set key(e) {
    s(this, d, e);
  }
  get maxOutputTokens() {
    return r(this, f);
  }
  set maxOutputTokens(e) {
    s(this, f, e);
  }
  get model() {
    return r(this, c);
  }
  set model(e) {
    s(this, c, e);
  }
  get temperature() {
    return r(this, l);
  }
  set temperature(e) {
    s(this, l, e);
  }
  get topP() {
    return r(this, m);
  }
  set topP(e) {
    s(this, m, e);
  }
  get topK() {
    return r(this, p);
  }
  set topK(e) {
    s(this, p, e);
  }
}
l = new WeakMap(), m = new WeakMap(), p = new WeakMap(), f = new WeakMap(), d = new WeakMap(), c = new WeakMap();
async function K(t, ...o) {
  let e;
  for (let a of o)
    a instanceof y && (e = a);
  if (e == null)
    throw new Error(
      "No configuration provided. You will need at least an environment key"
    );
  if (!("key" in e))
    throw new Error(
      "No environment key provided. You will need at least an environment key"
    );
  const k = new v(e.key).getGenerativeModel({
    model: e.model || "gemini-1.5-flash",
    generationConfig: e
  });
  return w(async () => {
    const a = [t[0]];
    for (let u = 0; u < o.length; u++) {
      let n = o[u];
      if ("brand" in n && typeof n.brand == "symbol" && Symbol.keyFor(n.brand) === "preact-signals" && (n = n.value), n instanceof x) {
        a.push(t[u + 1]);
        continue;
      }
      a.push(await n, t[u + 1]);
    }
    return (await (await k.generateContent(a.join(""))).response).text();
  });
}
export {
  x as GeminiPromptConfiguration,
  K as prompt
};
