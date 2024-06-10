import { computed } from "@preact/signals-core";

// A prompt template builder
async function prompt(strings, ...values) {
  if ("model" in globalThis == false && "ai" in globalThis) {
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  }

  const ai = globalThis.model || globalThis.ai;

  const possible = await ai.canCreateTextSession();

  if (possible == "no") {
    throw new Error(
      `The 'prompt' API is not available and not able to run in your browser.`,
    );
  }

  if (possible == "after-download") {
    throw new Error(
      `The 'prompt' API is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components`,
    );
  }

  const session = await ai.createTextSession();

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
    return session.prompt(result.join(""));
  });
}

export { prompt };
