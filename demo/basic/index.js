import { prompt } from "@paulkinlan/reactive-prompt/chrome";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
const response = await prompt`Say "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 1000);
