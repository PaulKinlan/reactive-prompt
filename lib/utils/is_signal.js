function isSignal(obj) {
  return (
    typeof obj != "string" &&
    "brand" in obj &&
    typeof obj.brand === "symbol" &&
    Symbol.keyFor(obj.brand) === "preact-signals"
  );
}

export { isSignal };
