import { PromptConfiguration } from "./configuration.js";
import { prompt as chromePrompt, ChromePromptConfiguration } from "./chrome.js";
import { prompt as geminiPrompt, GeminiPromptConfiguration } from "./gemini.js";
import { prompt as openAIPrompt, OpenAIPromptConfiguration } from "./openai.js";
import { prompt as ollamaPrompt, OllamaPromptConfiguration } from "./ollama.js";
import { isSignal } from "./utils/index.js";

export { PromptConfiguration };
export { chromePrompt, ChromePromptConfiguration };
export { geminiPrompt, GeminiPromptConfiguration };
export { openAIPrompt, OpenAIPromptConfiguration };
export { ollamaPrompt, OllamaPromptConfiguration };
export { isSignal };
