import { signal, effect } from "@preact/signals-core";
import { PromptConfiguration, isConfiguration } from "./configuration.js";
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

  if ("LanguageModel" in globalThis == false) {
    throw new Error(`The 'Prompt API' is not enabled in your browser. 

    Please use at least Chrome 127 and enable the following features:
    + chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
    + chrome://flags/#optimization-guide-on-device-model
    `);
  }

  const { LanguageModel } = globalThis;

  LanguageModel.availability().then(async (availability) => {
    if (availability == "no") {
      throw new Error(
        `The 'Prompt API' is not available and not able to run in your browser.`
      );
    }

    if (availability == "after-download") {
      throw new Error(
        `The 'Prompt API' is able to run in your browser but you need to download the model first. You can either wait or check the model availability in chrome://components`
      );
    }

    // Get model parameters for defaults
    const params = await LanguageModel.params();

    let configuration;

    for (let value of values) {
      // extract configuration
      if (isConfiguration(value)) {
        configuration = value;
      }
    }

    const debug = configuration?.debug || false;

    effect(() => {
      const promptText = accumulatedSignal.value;
      LanguageModel
        .create({
          topK: configuration?.topK || params?.defaultTopK,
          temperature:
            configuration?.temperature || params?.defaultTemperature,
        })
        .then((session) => {
          debug && console.log("Prompt:", promptText);
          session
            .prompt(promptText)
            .then((response) => {
              debug && console.log("Response:", response);
              returnSignal.value = response;
              session.destroy();
            })
            .catch((error) => {
              console.error("Prompt Error:", promptText, error);
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
