import { signal, effect } from "@preact/signals-core";
import { PromptConfiguration } from "./configuration.js";
import { accumulate } from "./utils/accumulate.js";

class ChromePromptConfiguration extends PromptConfiguration {
  #temperature;
  #topK;

  constructor({ temperature, topK, debug = false } = {}) {
    super({ debug });

    this.#temperature = temperature;
    this.#topK = topK;
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
function prompt(strings, ...values) {
  const returnSignal = signal();
  const accumulatedSignal = accumulate(
    strings,
    values,
    ChromePromptConfiguration
  );

  if ("ai" in globalThis == false) {
    throw new Error(`The 'prompt' API is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano
    + chrome://flags/#optimization-guide-on-device-model "Enable Bypass" 
    `);
  }

  const { ai } = globalThis;

  ai.languageModel.capabilities().then(async (defaults) => {
    const { available } = defaults;
    if (available == "no") {
      throw new Error(
        `The 'prompt' API is not available and not able to run in your browser.`
      );
    }

    if (available == "after-download") {
      throw new Error(
        `The 'prompt' API is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components`
      );
    }

    let configuration;

    for (let value of values) {
      // extract configuration
      if (value instanceof PromptConfiguration) {
        configuration = value;
      }
    }

    const debug = configuration?.debug || false;

    effect(() => {
      const promptText = accumulatedSignal.value;
      ai.languageModel
        .create({
          topK: configuration?.topK || defaults.defaultTopK,
          temperature:
            configuration?.temperature || defaults.defaultTemperature,
        })
        .then((session) => {
          debug && console.log("Prompt:", promptText);
          session.prompt(promptText).then((response) => {
            debug && console.log("Response:", response);
            returnSignal.value = response;
            session.destroy();
          });
        })
        .catch((error) => {
          console.error("Prompt Error:", error);
        });
    });
  });

  return returnSignal;
}

export { prompt, ChromePromptConfiguration };
