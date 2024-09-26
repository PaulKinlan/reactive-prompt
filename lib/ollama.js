import { Ollama } from "ollama/browser";
import { signal, effect } from "@preact/signals-core";
import { PromptConfiguration } from "./configuration.js";
import { accumulate } from "./utils/accumulate.js";

class OllamaPromptConfiguration extends PromptConfiguration {
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
  const accumulated = accumulate(strings, values, OllamaPromptConfiguration);

  let configuration;

  for (let value of values) {
    // extract configuration
    if (value instanceof PromptConfiguration) {
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

  const debug = configuration?.debug || false;

  const ollama = new Ollama({
    apiKey: configuration.key, // This is the default and can be omitted
  });

  effect(() => {
    const promptText = accumulated.value;
    ollama
      .generate({
        prompt: promptText,
        model: configuration.model || "llama3.2",
      })
      .then((chatCompletion) => {
        debug && console.log("Prompt:", promptText);
        debug && console.log("Response:", chatCompletion);
        returnSignal.value = chatCompletion.response;
      });
  });

  return returnSignal;
}

export { prompt, OllamaPromptConfiguration };
