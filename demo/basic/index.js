import { prompt } from "@paulkinlan/reactive-prompt/chrome";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
const response = prompt`Repeat "hello ${name}".`;

let effectCreated = false;

go.onclick = async () => {
  if (effectCreated == false) {
    // We have to do this because the Chrome Prompt API needs a user gesture to run.
    effect(async () => {
      const responseElement = document.getElementById("logPre");
      const responseValue = await response.value;
      if (responseValue) {
        responseElement.textContent = `${new Date().toISOString()} - ${responseValue}
${responseElement.textContent}`;
        console.log(responseValue);
      }
    });
    effectCreated = true;
  }
  setTimeout(() => (name.value = "Serene"), 1000);
};



