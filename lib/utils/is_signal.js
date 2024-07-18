function isSignal(obj) {
  return (
    obj != undefined &&
    typeof obj != "string" &&
    "brand" in obj &&
    typeof obj.brand === "symbol" &&
    Symbol.keyFor(obj.brand) === "preact-signals"
  );
}

export { isSignal };
