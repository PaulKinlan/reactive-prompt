import { prompt } from "../../dist/index.js"; //"@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
const response = await prompt`Say "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => (name.value = "Serene"), 3000);
