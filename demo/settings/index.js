import { prompt, ChromePromptConfiguration } from "../../dist/index.js";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
const config = new ChromePromptConfiguration();
config.temperature = 0.5;
config.topK = 10;
const response = await prompt`Say "hello ${name}".${config}`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 3000);
