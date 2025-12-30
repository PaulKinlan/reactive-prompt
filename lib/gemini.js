import { signal, effect } from "@preact/signals-core";
import { GoogleGenAI } from "@google/genai";
import { accumulate } from "./utils/accumulate.js";
import { PromptConfiguration, isConfiguration } from "./configuration.js";

class GeminiPromptConfiguration extends PromptConfiguration {
  #temperature;
  #topP;
  #topK;
  #maxOutputTokens;
  #key;
  #model;

  constructor({
    temperature,
    topP,
    topK,
    maxOutputTokens,
    key,
    model,
    debug = false,
  } = {}) {
    super({ debug });
    this.#temperature = temperature;
    this.#topP = topP;
    this.#topK = topK;
    this.#maxOutputTokens = maxOutputTokens;
    this.#key = key;
    this.#model = model;
  }

  get key() {
    return this.#key;
  }

  set key(value) {
    this.#key = value;
  }

  get maxOutputTokens() {
    return this.#maxOutputTokens;
  }

  set maxOutputTokens(value) {
    this.#maxOutputTokens = value;
  }

  get model() {
    return this.#model;
  }

  set model(value) {
    this.#model = value;
  }

  get temperature() {
    return this.#temperature;
  }

  set temperature(value) {
    this.#temperature = value;
  }

  get topP() {
    return this.#topP;
  }

  set topP(value) {
    this.#topP = value;
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
  const accumulated = accumulate(strings, values, GeminiPromptConfiguration);

  let configuration;

  for (let value of values) {
    // extract configuration
    if (isConfiguration(value)) {
      configuration = value;
    }
  }

  if (configuration == null) {
    throw new Error(
      "No configuration provided. You will need at least an environment key"
    );
  }

  if ("key" in configuration == false) {
    throw new Error(
      "No environment key provided. You will need at least an environment key"
    );
  }

  const ai = new GoogleGenAI({ apiKey: configuration.key });

  const debug = configuration?.debug || false;

  effect(() => {
    const promptText = accumulated.value;
    
    // Build the config object with optional parameters
    const requestConfig = {};
    if (configuration.temperature !== undefined) {
      requestConfig.temperature = configuration.temperature;
    }
    if (configuration.topP !== undefined) {
      requestConfig.topP = configuration.topP;
    }
    if (configuration.topK !== undefined) {
      requestConfig.topK = configuration.topK;
    }
    if (configuration.maxOutputTokens !== undefined) {
      requestConfig.maxOutputTokens = configuration.maxOutputTokens;
    }
    
    ai.models
      .generateContent({
        model: configuration.model || "gemini-3-flash-preview",
        contents: promptText,
        config: Object.keys(requestConfig).length > 0 ? requestConfig : undefined,
      })
      .then((response) => {
        debug && console.log("Prompt:", promptText);
        debug && console.log("Response:", response);
        returnSignal.value = response.text;
      });
  });

  return returnSignal;
}

export { prompt, GeminiPromptConfiguration };
