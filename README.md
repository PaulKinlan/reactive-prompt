# Reactive Prompt using Signals

I've been doing a lot of work on [Breadboard](https://github.com/breadboard-ai/breadboard). Breadboard is great because it changes the way you think about data flow through an LLM application by focusing on thinking about graphs. One of the things it does well is reacting to inputs updating and chaining of prompts. I wanted to see if I can make a simple imperative way to react to changing inputs.

I thought it would be neat to experiment with:

1. Prompt resoponses should react as the inputs change.
2. You should be able to chain responses easily, that is the output of one response can be used in another prompt.

Preact's `Signals` seemed like an ideal way to manage this.

The `reactive-prompt` library exports a single function called `prompt` (streaming coming soon). It's a tagged template litteral which allows you to substitute any variable including Signals. When a Signal is referenced and updated, it's prompt will be recalculated.... and now we have reactive prompts.

### Simple Demo

```JavaScript
import { prompt } from "@paulkinlan/reactive-prompt/chrome";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const response = prompt`Say "Hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => name.value = "Serene", 2000);
```

### Prompt Chaining

You can chain multiple prompts together, that is the output of one prompt can be the input of another prompt. For sufficiently complex data flows this means that you only the prompts that need updating will be re-run.

```JavaScript
import { prompt } from "@paulkinlan/reactive-prompt/chrome";
import { signal, effect } from "@preact/signals-core";

const nameSignal = signal("Paul Kinlan");

const prompterSignal = prompt`Using "${nameSignal}", extract the following data:

+ First name
+ Surname
+ Date of Birth

Return as valid JSON
"`;

const uiBuilderSignal = prompt`You are an expert web developer, and you have been tasked with creating a form for a client. The form should have the following fields: "${prompterSignal}".

Return the required HTML for the form only and populate the default values.`;

effect(async () => {
  const val = await uiBuilderSignal.value;
  output.innerHTML = parseCodeFromMarkdown(val);
});

setTimeout(() => name.value = "Jack Jones", 5000);
```

### Custom Settings

Many LLM's require custom settings, however this implementation that uses tagged template litterals that return a signal has forgone a typical constructor where you might be able to add in custom configuration such as `temperature`, `topK` or even environment variables. To get around this, we use a custom `PromptConfiguration` object that can be embeded in a prompt and used by the underlying implementation. This configuration will be removed from the acutal prompt when it's executed.

Note: `ChromePromptConfiguration` is a subclass of `PromptConfiguration` and enables you to set the specific configuration options for Chrome's prompting library. When we add support for more LLM's each LLM will have it's own `PromptConfiguration` subclass.

```JavaScript
import { prompt, ChromePromptConfiguration } from "@paulkinlan/reactive-prompt/chrome";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
const config = new ChromePromptConfiguration();
config.temperature = 0.5;
config.topK = 10;
const response = prompt`${config}Say "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 3000);
```

## Chrome's experimental prompt API

This library relies on Chrome's experiemental prompt API.

To use this, you need at least Chrome 127 (Dev Channel) and to enable the following flags.

- chrome://flags/#prompt-api-for-gemini-nano
- chrome://flags/#optimization-guide-on-device-model "Enable Bypass"

## Using the Gemini API

You can now do text completion against Gemini. Import the Gemini module
and use the same `prompt` function. This function requires a mandatory instance of `GeminiPromptConfiguration` with your Gemini API key.

```JavaScript
import {
  prompt,
  GeminiPromptConfiguration,
} from "@paulkinlan/reactive-prompt/gemini";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const config = new GeminiPromptConfiguration();
config.key = window.prompt("API Key");
const response = prompt`${config}Just say the words "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 3000);
```

## Using the OpenAI API

You can now do text completion against OpenAI. Import the OpenAI module
and use the same `prompt` function. This function requires a mandatory instance of `OpenAIPromptConfiguration` with your OpenAI API key.

```JavaScript
import {
  prompt,
  OpenAIPromptConfiguration,
} from "@paulkinlan/reactive-prompt/openai";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const config = new OpenAIPromptConfiguration();
config.key = window.prompt("API Key");
const response = prompt`${config}Just say the words "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 3000);
```

## Using the Ollama API

You can now do text completion against Ollama. Import the Ollama module
and use the same `prompt` function. This function does not require a configuration object and will default to `llama3.2` as the model. If you need to change the model, you can pass in a `model` property in to the `OllamaPromptConfiguration` object.

```JavaScript
import {
  prompt,
  OllamaPromptConfiguration,
} from "@paulkinlan/reactive-prompt/ollama";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const config = new OllamaPromptConfiguration();
const response = prompt`${config}Just say the words "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 3000);

```
