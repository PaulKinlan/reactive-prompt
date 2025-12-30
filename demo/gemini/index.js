import {
  prompt,
  GeminiPromptConfiguration,
} from "@paulkinlan/reactive-prompt/gemini";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");
let response = null;
let effectCreated = false;

const apiKeyForm = document.getElementById("apiKeyForm");

apiKeyForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const apiKeyInput = document.getElementById("apiKey");
  const apiKey = apiKeyInput.value;
  
  if (!apiKey) {
    const responseElement = document.getElementById("logPre");
    responseElement.textContent = `${new Date().toISOString()} - No API key provided\n${responseElement.textContent}`;
    return;
  }

  const config = new GeminiPromptConfiguration();
  config.key = apiKey;

  if (effectCreated == false) {
    response = prompt`${config}Repeat the following words: "hello ${name}".`;

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
  
  setTimeout(() => (name.value = "Serene"), 3000);
};
