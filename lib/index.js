import { computed } from "@preact/signals-core";

// A prompt template builder
function prompt(strings, ...values) {
  const session = model.createTextSession();

  return computed(async () => {
    const result = [strings[0]];
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let value = values[valueIdx];
      if (
        "brand" in value &&
        typeof value.brand === "symbol" &&
        Symbol.keyFor(value.brand) === "preact-signals"
      ) {
        value = value.value;
      }
      result.push(await value, strings[valueIdx + 1]);
    }
    return session.then((_) => _.prompt(result.join("")));
  });
}

export { prompt };
