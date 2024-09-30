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
  #host;

  constructor({
    temperature,
    topP,
    topK,
    maxOutputTokens,
    key,
    model,
    host,
    debug = false,
  } = {}) {
    super({ debug });
    this.#temperature = temperature;
    this.#topP = topP;
    this.#topK = topK;
    this.#maxOutputTokens = maxOutputTokens;
    this.#key = key;
    this.#model = model;
    this.#host = host;
  }

  get host() {
    return this.#host;
  }

  set host(value) {
    this.#host = value;
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

  const debug = configuration?.debug || false;
  const host = configuration?.host;
  const model = configuration?.model || "llama3.2";

  const ollama = new Ollama({ host });

  effect(() => {
    const promptText = accumulated.value;
    ollama
      .generate({
        prompt: promptText,
        model,
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
