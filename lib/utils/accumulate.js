import { signal, effect } from "@preact/signals-core";
import { isSignal } from "./is_signal.js";

function accumulate(strings, values, configurationClass) {
  const returnSignal = signal();
  effect(() => {
    const result = [strings[0]];
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let value = values[valueIdx];
      if (isSignal(value)) {
        // This dereference sets up the notification dependency
        value = value.value;
      }

      if (value instanceof configurationClass) {
        result.push(strings[valueIdx + 1]);
        continue; // We don't need to add the value to the result
      }

      // TODO: if value is a promise we need to work out how to resolve it as we add it.
      result.push(value, strings[valueIdx + 1]);
    }

    returnSignal.value = result.join("");
  });

  return returnSignal;
}

export { accumulate };
