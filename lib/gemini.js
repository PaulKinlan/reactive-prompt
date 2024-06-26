import { computed } from "@preact/signals-core";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
async function prompt(strings, ...values) {
  let configutation;

  for (let value of values) {
    // extract configuration
    if (value instanceof PromptConfiguration) {
      configutation = value;
    }
  }

  if (configutation == null) {
    throw new Error(
      "No configuration provided. You will need at least an environment key",
    );
  }

  if ("key" in configutation == false) {
    throw new Error(
      "No environment key provided. You will need at least an environment key",
    );
  }

  const genAI = new GoogleGenerativeAI(configutation.key);

  const model = genAI.getGenerativeModel({
    model: configutation.model || "gemini-1.5-flash",
    generationConfig: configutation,
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

      if (value instanceof GeminiPromptConfiguration) {
        result.push(strings[valueIdx + 1]);
        continue; // We don't need to add the value to the result
      }

      result.push(await value, strings[valueIdx + 1]);
    }

    const modelResult = await model.generateContent(result.join(""));
    const response = await modelResult.response;

    return response.text();
  });
}

export { prompt, GeminiPromptConfiguration };
