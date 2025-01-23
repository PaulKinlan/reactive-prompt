import { signal, effect } from "@preact/signals-core";
import Anthropic from "@anthropic-ai/sdk";
import { accumulate } from "./utils/accumulate.js";
import { PromptConfiguration, isConfiguration } from "./configuration.js";

class ClaudePromptConfiguration extends PromptConfiguration {
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
  const accumulated = accumulate(strings, values, ClaudePromptConfiguration);

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

  const anthropic = new Anthropic({
    apiKey: configuration.key,
    dangerouslyAllowBrowser: configuration.dangerouslyAllowBrowser || false,
  });
  const debug = configuration?.debug || false;

  effect(() => {
    const promptText = accumulated.value;
    anthropic.messages
      .create({
        model: configuration.model || "claude-3-5-sonnet-20241022",
        max_tokens: configuration.maxOutputTokens || 8192,
        messages: [{ role: "user", content: promptText }],
      })
      .then((chatCompletion) => {
        debug && console.log("Prompt:", promptText);
        debug && console.log("Response:", chatCompletion);
        returnSignal.value = chatCompletion.content[0].text;
      });
  });

  return returnSignal;
}

export { prompt, ClaudePromptConfiguration };
