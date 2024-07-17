import { signal, effect } from "@preact/signals-core";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { accumulate } from "./utils/accumulate.js";
import { PromptConfiguration } from "./configuration.js";

class GeminiPromptConfiguration extends PromptConfiguration {
  #temperature;
  #topP;
  #topK;
  #maxOutputTokens;
  #key;
  #model;

  constructor() {
    super();
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

  const genAI = new GoogleGenerativeAI(configuration.key);

  const model = genAI.getGenerativeModel({
    model: configuration.model || "gemini-1.5-flash",
    generationConfig: configuration,
  });

  effect(() => {
    model
      .generateContent(accumulated.value)
      .then((modelResult) => {
        return modelResult.response;
      })
      .then((response) => {
        returnSignal.value = response.text();
      });
  });

  return returnSignal;
}

export { prompt, GeminiPromptConfiguration };
