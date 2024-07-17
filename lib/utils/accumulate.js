import { signal, effect } from "@preact/signals-core";

function accumulate(strings, values, configurationClass) {
  const returnSignal = signal();
  effect(() => {
    const result = [strings[0]];
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let value = values[valueIdx];
      if (
        typeof value != "string" &&
        "brand" in value &&
        typeof value.brand === "symbol" &&
        Symbol.keyFor(value.brand) === "preact-signals"
      ) {
        // This dereference sets up the notification dependency
        value = value.value;
      }

      if (value instanceof configurationClass) {
        result.push(strings[valueIdx + 1]);
        continue; // We don't need to add the value to the result
      }

      result.push(value, strings[valueIdx + 1]);
    }

    returnSignal.value = result.join("");
  });

  return returnSignal;
}

export { accumulate };
