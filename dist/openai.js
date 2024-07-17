var f = (t, o, e) => {
  if (!o.has(t))
    throw TypeError("Cannot " + e);
};
var r = (t, o, e) => (f(t, o, "read from private field"), e ? e.call(t) : o.get(t)), n = (t, o, e) => {
  if (o.has(t))
    throw TypeError("Cannot add the same private member more than once");
  o instanceof WeakSet ? o.add(t) : o.set(t, e);
}, s = (t, o, e, h) => (f(t, o, "write to private field"), h ? h.call(t, e) : o.set(t, e), e);
import k from "openai";
import "@preact/signals-core";
import { P as w, a as A } from "./accumulate-6PdxjI_q.js";
var a, l, u, p, m, c, g;
class v extends w {
  constructor() {
    super();
    n(this, a, void 0);
    n(this, l, void 0);
    n(this, u, void 0);
    n(this, p, void 0);
    n(this, m, void 0);
    n(this, c, void 0);
    n(this, g, !1);
  }
  get dangerouslyAllowBrowser() {
    return r(this, g);
  }
  set dangerouslyAllowBrowser(e) {
    s(this, g, e);
  }
  get key() {
    return r(this, m);
  }
  set key(e) {
    s(this, m, e);
  }
  get maxOutputTokens() {
    return r(this, p);
  }
  set maxOutputTokens(e) {
    s(this, p, e);
  }
  get model() {
    return r(this, c);
  }
  set model(e) {
    s(this, c, e);
  }
  get temperature() {
    return r(this, a);
  }
  set temperature(e) {
    s(this, a, e);
  }
  get topP() {
    return r(this, l);
  }
  set topP(e) {
    s(this, l, e);
  }
  get topK() {
    return r(this, u);
  }
  set topK(e) {
    s(this, u, e);
  }
}
a = new WeakMap(), l = new WeakMap(), u = new WeakMap(), p = new WeakMap(), m = new WeakMap(), c = new WeakMap(), g = new WeakMap();
function K(t, ...o) {
  const e = signal(), h = A(t, o, v);
  let i;
  for (let d of o)
    d instanceof w && (i = d);
  if (i == null)
    throw new Error(
      "No configuration provided. You will need at least an environment key"
    );
  if (!("key" in i))
    throw new Error(
      "No environment key provided. You will need at least an environment key"
    );
  const y = new k({
    apiKey: i.key,
    // This is the default and can be omitted
    dangerouslyAllowBrowser: i.dangerouslyAllowBrowser || !1
  });
  return effect(() => {
    y.chat.completions.create({
      messages: [{ role: "user", content: h.value }],
      model: i.model || "gpt-3.5-turbo"
    }).then((d) => {
      e.value = d.choices[0].message.content;
    });
  }), e;
}
export {
  v as OpenAIPromptConfiguration,
  K as prompt
};
