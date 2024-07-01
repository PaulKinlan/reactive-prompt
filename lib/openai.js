import OpenAI from "openai";
import { computed } from "@preact/signals-core";
import { PromptConfiguration } from "./configuration.js";

class OpenAIPromptConfiguration extends PromptConfiguration {
  #temperature;
  #topP;
  #topK;
  #maxOutputTokens;
  #key;
  #model;
  #dangerouslyAllowBrowser = false;

  constructor() {
    super();
  }

  get dangerouslyAllowBrowser() {
    return this.#dangerouslyAllowBrowser;
  }

  set dangerouslyAllowBrowser(value) {
    this.#dangerouslyAllowBrowser = value;
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

  const genAI = new OpenAI({
    apiKey: configutation.key, // This is the default and can be omitted
    dangerouslyAllowBrowser: configutation.dangerouslyAllowBrowser || false,
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

      if (value instanceof OpenAIPromptConfiguration) {
        result.push(strings[valueIdx + 1]);
        continue; // We don't need to add the value to the result
      }

      result.push(await value, strings[valueIdx + 1]);
    }

    const chatCompletion = await genAI.chat.completions.create({
      messages: [{ role: "user", content: result.join("") }],
      model: configutation.model || "gpt-3.5-turbo",
    });

    return chatCompletion.choices[0].message.content;
  });
}

export { prompt, OpenAIPromptConfiguration };
