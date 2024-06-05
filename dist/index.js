var g = Symbol.for("preact-signals");
function p() {
  if (h > 1)
    h--;
  else {
    for (var t, i = !1; u !== void 0; ) {
      var o = u;
      for (u = void 0, c++; o !== void 0; ) {
        var f = o.o;
        if (o.o = void 0, o.f &= -3, !(8 & o.f) && S(o))
          try {
            o.c();
          } catch (s) {
            i || (t = s, i = !0);
          }
        o = f;
      }
    }
    if (c = 0, h--, i)
      throw t;
  }
}
var n = void 0, u = void 0, h = 0, c = 0, a = 0;
function l(t) {
  if (n !== void 0) {
    var i = t.n;
    if (i === void 0 || i.t !== n)
      return i = { i: 0, S: t, p: n.s, n: void 0, t: n, e: void 0, x: void 0, r: i }, n.s !== void 0 && (n.s.n = i), n.s = i, t.n = i, 32 & n.f && t.S(i), i;
    if (i.i === -1)
      return i.i = 0, i.n !== void 0 && (i.n.p = i.p, i.p !== void 0 && (i.p.n = i.n), i.p = n.s, i.n = void 0, n.s.n = i, n.s = i), i;
  }
}
function r(t) {
  this.v = t, this.i = 0, this.n = void 0, this.t = void 0;
}
r.prototype.brand = g;
r.prototype.h = function() {
  return !0;
};
r.prototype.S = function(t) {
  this.t !== t && t.e === void 0 && (t.x = this.t, this.t !== void 0 && (this.t.e = t), this.t = t);
};
r.prototype.U = function(t) {
  if (this.t !== void 0) {
    var i = t.e, o = t.x;
    i !== void 0 && (i.x = o, t.e = void 0), o !== void 0 && (o.e = i, t.x = void 0), t === this.t && (this.t = o);
  }
};
r.prototype.subscribe = function(t) {
  var i = this;
  return E(function() {
    var o = i.value, f = n;
    n = void 0;
    try {
      t(o);
    } finally {
      n = f;
    }
  });
};
r.prototype.valueOf = function() {
  return this.value;
};
r.prototype.toString = function() {
  return this.value + "";
};
r.prototype.toJSON = function() {
  return this.value;
};
r.prototype.peek = function() {
  var t = n;
  n = void 0;
  try {
    return this.value;
  } finally {
    n = t;
  }
};
Object.defineProperty(r.prototype, "value", { get: function() {
  var t = l(this);
  return t !== void 0 && (t.i = this.i), this.v;
}, set: function(t) {
  if (t !== this.v) {
    if (c > 100)
      throw new Error("Cycle detected");
    this.v = t, this.i++, a++, h++;
    try {
      for (var i = this.t; i !== void 0; i = i.x)
        i.t.N();
    } finally {
      p();
    }
  }
} });
function S(t) {
  for (var i = t.s; i !== void 0; i = i.n)
    if (i.S.i !== i.i || !i.S.h() || i.S.i !== i.i)
      return !0;
  return !1;
}
function w(t) {
  for (var i = t.s; i !== void 0; i = i.n) {
    var o = i.S.n;
    if (o !== void 0 && (i.r = o), i.S.n = i, i.i = -1, i.n === void 0) {
      t.s = i;
      break;
    }
  }
}
function x(t) {
  for (var i = t.s, o = void 0; i !== void 0; ) {
    var f = i.p;
    i.i === -1 ? (i.S.U(i), f !== void 0 && (f.n = i.n), i.n !== void 0 && (i.n.p = f)) : o = i, i.S.n = i.r, i.r !== void 0 && (i.r = void 0), i = f;
  }
  t.s = o;
}
function v(t) {
  r.call(this, void 0), this.x = t, this.s = void 0, this.g = a - 1, this.f = 4;
}
(v.prototype = new r()).h = function() {
  if (this.f &= -3, 1 & this.f)
    return !1;
  if ((36 & this.f) == 32 || (this.f &= -5, this.g === a))
    return !0;
  if (this.g = a, this.f |= 1, this.i > 0 && !S(this))
    return this.f &= -2, !0;
  var t = n;
  try {
    w(this), n = this;
    var i = this.x();
    (16 & this.f || this.v !== i || this.i === 0) && (this.v = i, this.f &= -17, this.i++);
  } catch (o) {
    this.v = o, this.f |= 16, this.i++;
  }
  return n = t, x(this), this.f &= -2, !0;
};
v.prototype.S = function(t) {
  if (this.t === void 0) {
    this.f |= 36;
    for (var i = this.s; i !== void 0; i = i.n)
      i.S.S(i);
  }
  r.prototype.S.call(this, t);
};
v.prototype.U = function(t) {
  if (this.t !== void 0 && (r.prototype.U.call(this, t), this.t === void 0)) {
    this.f &= -33;
    for (var i = this.s; i !== void 0; i = i.n)
      i.S.U(i);
  }
};
v.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var t = this.t; t !== void 0; t = t.x)
      t.t.N();
  }
};
Object.defineProperty(v.prototype, "value", { get: function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  var t = l(this);
  if (this.h(), t !== void 0 && (t.i = this.i), 16 & this.f)
    throw this.v;
  return this.v;
} });
function m(t) {
  return new v(t);
}
function b(t) {
  var i = t.u;
  if (t.u = void 0, typeof i == "function") {
    h++;
    var o = n;
    n = void 0;
    try {
      i();
    } catch (f) {
      throw t.f &= -2, t.f |= 8, y(t), f;
    } finally {
      n = o, p();
    }
  }
}
function y(t) {
  for (var i = t.s; i !== void 0; i = i.n)
    i.S.U(i);
  t.x = void 0, t.s = void 0, b(t);
}
function U(t) {
  if (n !== this)
    throw new Error("Out-of-order effect");
  x(this), n = t, this.f &= -2, 8 & this.f && y(this), p();
}
function d(t) {
  this.x = t, this.u = void 0, this.s = void 0, this.o = void 0, this.f = 32;
}
d.prototype.c = function() {
  var t = this.S();
  try {
    if (8 & this.f || this.x === void 0)
      return;
    var i = this.x();
    typeof i == "function" && (this.u = i);
  } finally {
    t();
  }
};
d.prototype.S = function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  this.f |= 1, this.f &= -9, b(this), w(this), h++;
  var t = n;
  return n = this, U.bind(this, t);
};
d.prototype.N = function() {
  2 & this.f || (this.f |= 2, this.o = u, u = this);
};
d.prototype.d = function() {
  this.f |= 8, 1 & this.f || y(this);
};
function E(t) {
  var i = new d(t);
  try {
    i.c();
  } catch (o) {
    throw i.d(), o;
  }
  return i.d.bind(i);
}
function N(t, ...i) {
  const o = model.createTextSession();
  return m(async () => {
    const f = [t[0]];
    for (let s = 0; s < i.length; s++) {
      let e = i[s];
      "brand" in e && typeof e.brand == "symbol" && Symbol.keyFor(e.brand) === "preact-signals" && (e = e.value), f.push(await e, t[s + 1]);
    }
    return o.then((s) => s.prompt(f.join("")));
  });
}
export {
  N as prompt
};
