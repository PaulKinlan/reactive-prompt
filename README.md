# Reactive Prompt using Signals

I've been doing a lot of work on [Breadboard](https://github.com/breadboard-ai/breadboard). Breadboard is great because it changes the way you think about data flow through an LLM application by focusing on thinking about graphs. One of the things it does well is reacting to inputs updating and chaining of prompts. I wanted to see if I can make a simple imperative way to react to changing inputs.

I thought it would be neat to experiment with:

1. Prompt resoponses should react as the inputs change.
2. You should be able to chain responses easily, that is the output of one response can be used in another prompt.

Preact's `Signals` seemed like an ideal way to manage this.

The `reactive-prompt` library exports a single function called `prompt`. It's a tagged template litteral which allows you to substitute any variable including Signals. When a Signal is referenced and updated, it's prompt will be recalculated.... and now we have reactive prompts.

### Simple Demo

```JavaScript
import { prompt } from "@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const response = await prompt`Say "Hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => name.value = "Serene", 2000);
```

### Prompt Chaining

You can chain multiple prompts together, that is the output of one prompt can be the input of another prompt. For sufficiently complex data flows this means that you only the prompts that need updating will be re-run.

```JavaScript
import { prompt } from "@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const nameSignal = signal("Paul Kinlan");

const prompterSignal = await prompt`Using "${nameSignal}", extract the following data:

+ First name
+ Surname
+ Date of Birth

Return as valid JSON
"`;

const uiBuilderSignal = await prompt`You are an expert web developer, and you have been tasked with creating a form for a client. The form should have the following fields: "${prompterSignal}".

Return the required HTML for the form only and populate the default values.`;

effect(async () => {
  const val = await uiBuilderSignal.value;
  output.innerHTML = parseCodeFromMarkdown(val);
});

setTimeout(() => name.value = "Jack Jones", 5000);
```

## Chrome's experimental prompt API

This library relies on Chrome's experiemental prompt API.

To use this, you need at least Chrome 127 (Dev Channel) and to enable the following flags.

* chrome://flags/#prompt-api-for-gemini-nano
* chrome://flags/#optimization-guide-on-device-model "Enable Bypass"

## What about other prompt APIs?

The `prompt` tagged template can easily be ported to other APIs. I haven't done it, but it should be possible.