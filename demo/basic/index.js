import { compile } from "@paulkinlan/reactive-prompt";
import { effect } from "@preact/signals-core";

const name = signal("Paul");
const response = compile`Say "hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

name.value = "Serene";
