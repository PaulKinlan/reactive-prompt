var y = (t, o, e) => {
  if (!o.has(t))
    throw TypeError("Cannot " + e);
};
var r = (t, o, e) => (y(t, o, "read from private field"), e ? e.call(t) : o.get(t)), n = (t, o, e) => {
  if (o.has(t))
    throw TypeError("Cannot add the same private member more than once");
  o instanceof WeakSet ? o.add(t) : o.set(t, e);
}, s = (t, o, e, g) => (y(t, o, "write to private field"), g ? g.call(t, e) : o.set(t, e), e);
import k from "openai";
import { computed as A } from "@preact/signals-core";
import { P as w } from "./configuration-W3kPAhYs.js";
var u, p, m, c, h, d, f;
class v extends w {
  constructor() {
    super();
    n(this, u, void 0);
    n(this, p, void 0);
    n(this, m, void 0);
    n(this, c, void 0);
    n(this, h, void 0);
    n(this, d, void 0);
    n(this, f, !1);
  }
  get dangerouslyAllowBrowser() {
    return r(this, f);
  }
  set dangerouslyAllowBrowser(e) {
    s(this, f, e);
  }
  get key() {
    return r(this, h);
  }
  set key(e) {
    s(this, h, e);
  }
  get maxOutputTokens() {
    return r(this, c);
  }
  set maxOutputTokens(e) {
    s(this, c, e);
  }
  get model() {
    return r(this, d);
  }
  set model(e) {
    s(this, d, e);
  }
  get temperature() {
    return r(this, u);
  }
  set temperature(e) {
    s(this, u, e);
  }
  get topP() {
    return r(this, p);
  }
  set topP(e) {
    s(this, p, e);
  }
  get topK() {
    return r(this, m);
  }
  set topK(e) {
    s(this, m, e);
  }
}
u = new WeakMap(), p = new WeakMap(), m = new WeakMap(), c = new WeakMap(), h = new WeakMap(), d = new WeakMap(), f = new WeakMap();
async function C(t, ...o) {
  let e;
  for (let a of o)
    a instanceof w && (e = a);
  if (e == null)
    throw new Error(
      "No configuration provided. You will need at least an environment key"
    );
  if (!("key" in e))
    throw new Error(
      "No environment key provided. You will need at least an environment key"
    );
  const g = new k({
    apiKey: e.key,
    // This is the default and can be omitted
    dangerouslyAllowBrowser: e.dangerouslyAllowBrowser || !1
  });
  return A(async () => {
    const a = [t[0]];
    for (let l = 0; l < o.length; l++) {
      let i = o[l];
      if ("brand" in i && typeof i.brand == "symbol" && Symbol.keyFor(i.brand) === "preact-signals" && (i = i.value), i instanceof v) {
        a.push(t[l + 1]);
        continue;
      }
      a.push(await i, t[l + 1]);
    }
    return (await g.chat.completions.create({
      messages: [{ role: "user", content: a.join("") }],
      model: e.model || "gpt-3.5-turbo"
    })).choices[0].message.content;
  });
}
export {
  v as OpenAIPromptConfiguration,
  C as prompt
};
