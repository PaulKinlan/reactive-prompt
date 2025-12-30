import {
  prompt,
  GeminiPromptConfiguration,
} from "@paulkinlan/reactive-prompt/gemini";
import { signal, effect } from "@preact/signals-core";

const DELAY_MS = 3000;
const name = signal("Paul");
let response = null;
let effectCreated = false;

const apiKeyForm = document.getElementById("apiKeyForm");
const logElement = document.getElementById("logPre");

apiKeyForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const apiKeyInput = document.getElementById("apiKey");
  const apiKey = apiKeyInput.value;
  
  if (!apiKey) {
    logElement.textContent = `${new Date().toISOString()} - No API key provided\n${logElement.textContent}`;
    return;
  }

  const config = new GeminiPromptConfiguration();
  config.key = apiKey;

  if (!effectCreated) {
    response = prompt`${config}Repeat the following words: "hello ${name}".`;

    effect(async () => {
      const responseValue = await response.value;
      if (responseValue) {
        const timestamp = new Date().toISOString();
        logElement.textContent = `${timestamp} - ${responseValue}\n${logElement.textContent}`;
        console.log(responseValue);
      }
    });
    effectCreated = true;
  }
  
  setTimeout(() => (name.value = "Serene"), DELAY_MS);
};
