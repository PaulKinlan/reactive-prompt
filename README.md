# Reactive Prompt using Signals

I've been doing a lot of work on [Breadboard](https://github.com/breadboard-ai/breadboard). Breadboard is great because it changes the way you think about data flow through an LLM application by focusing on thinking about graphs. One of the things it does well is reacting to inputs updating and chaining of prompts. I wanted to see if I can make a simple imperative way to react to changing inputs.

I thought it would be neat to experiment with:

1. Prompt resoponses should react as the inputs change.
2. You should be able to chain responses easily, that is the output of one response can be used in another prompt.

Preact's `Signals` seemed like an ideal way to manage this.

The `reactive-prompt` library exports a single function called `compile`. It's a tagged template litteral which allows you to substitute any variable including Signals. When a Signal is referenced, it's prompt will be recalculated, and there we have reactive prompts.

```JavaScript
import { compile } from "@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const response = compile`Say "Hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => name.value = "Serene", 2000);
```

## Chrome's experimental prompt API

This library relies on Chrome's experiemental prompt API.

To use this, you need at least Chrome 127 (Dev Channel) and to enable the following flags.

* chrome://flags/#prompt-api-for-gemini-nano
* chrome://flags/#optimization-guide-on-device-model "Enable Bypass"

## What about other prompt APIs?

The `compile` tagged template can easily be ported to other APIs. I haven't done it, but it should be possible.