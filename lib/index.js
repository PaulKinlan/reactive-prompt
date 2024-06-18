import { computed } from "@preact/signals-core";

class PromptConfiguration {}

class ChromePromptConfiguration extends PromptConfiguration {
  #temperature;
  #topK;

  constructor() {
    super();
  }

  get temperature() {
    return this.#temperature;
  }

  set temperature(value) {
    this.#temperature = value;
  }

  get topK() {
    return this.#topK;
  }

  set topK(value) {
    this.#topK = value;
  }
}

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
  const defaults = await ai.defaultTextSessionOptions();

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

  let configutation;

  for (let value of values) {
    // extract configuration
    if (value instanceof PromptConfiguration) {
      configutation = value;
    }
  }

  const session = await ai.createTextSession({
    topK: configutation?.topK || defaults.topK,
    temperature: configutation?.temperature || defaults.temperature,
  });

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

      if (value instanceof ChromePromptConfiguration) {
        continue; // We don't need to add the value to the result
      }

      result.push(await value, strings[valueIdx + 1]);
    }
    return session.prompt(result.join(""));
  });
}

export { prompt, PromptConfiguration, ChromePromptConfiguration };
