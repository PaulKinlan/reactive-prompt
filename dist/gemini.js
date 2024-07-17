var c = (t, n, e) => {
  if (!n.has(t))
    throw TypeError("Cannot " + e);
};
var o = (t, n, e) => (c(t, n, "read from private field"), e ? e.call(t) : n.get(t)), r = (t, n, e) => {
  if (n.has(t))
    throw TypeError("Cannot add the same private member more than once");
  n instanceof WeakSet ? n.add(t) : n.set(t, e);
}, i = (t, n, e, h) => (c(t, n, "write to private field"), h ? h.call(t, e) : n.set(t, e), e);
import { effect as v } from "@preact/signals-core";
import { GoogleGenerativeAI as y } from "@google/generative-ai";
import { P as d, a as w } from "./accumulate-6PdxjI_q.js";
var u, m, l, p, g, f;
class x extends d {
  constructor() {
    super();
    r(this, u, void 0);
    r(this, m, void 0);
    r(this, l, void 0);
    r(this, p, void 0);
    r(this, g, void 0);
    r(this, f, void 0);
  }
  get key() {
    return o(this, g);
  }
  set key(e) {
    i(this, g, e);
  }
  get maxOutputTokens() {
    return o(this, p);
  }
  set maxOutputTokens(e) {
    i(this, p, e);
  }
  get model() {
    return o(this, f);
  }
  set model(e) {
    i(this, f, e);
  }
  get temperature() {
    return o(this, u);
  }
  set temperature(e) {
    i(this, u, e);
  }
  get topP() {
    return o(this, m);
  }
  set topP(e) {
    i(this, m, e);
  }
  get topK() {
    return o(this, l);
  }
  set topK(e) {
    i(this, l, e);
  }
}
u = new WeakMap(), m = new WeakMap(), l = new WeakMap(), p = new WeakMap(), g = new WeakMap(), f = new WeakMap();
function K(t, ...n) {
  const e = signal(), h = w(t, n, x);
  let s;
  for (let a of n)
    a instanceof d && (s = a);
  if (s == null)
    throw new Error(
      "No configuration provided. You will need at least an environment key"
    );
  if (!("key" in s))
    throw new Error(
      "No environment key provided. You will need at least an environment key"
    );
  const k = new y(s.key).getGenerativeModel({
    model: s.model || "gemini-1.5-flash",
    generationConfig: s
  });
  return v(() => {
    k.generateContent(h.value).then((a) => a.response).then((a) => {
      e.value = a.text();
    });
  }), e;
}
export {
  x as GeminiPromptConfiguration,
  K as prompt
};
