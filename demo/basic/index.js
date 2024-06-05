import { prompt } from "@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
const response = prompt`Say "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

name.value = "Serene";
