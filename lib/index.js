import { PromptConfiguration, isConfiguration } from "./configuration.js";
import { prompt as chromePrompt, ChromePromptConfiguration } from "./chrome.js";
import { prompt as geminiPrompt, GeminiPromptConfiguration } from "./gemini.js";
import { prompt as openAIPrompt, OpenAIPromptConfiguration } from "./openai.js";
import { prompt as ollamaPrompt, OllamaPromptConfiguration } from "./ollama.js";
import { prompt as claudePrompt, ClaudePromptConfiguration } from "./claude.js";
import { isSignal } from "./utils/index.js";

export { PromptConfiguration, isConfiguration };
export { chromePrompt, ChromePromptConfiguration };
export { geminiPrompt, GeminiPromptConfiguration };
export { openAIPrompt, OpenAIPromptConfiguration };
export { ollamaPrompt, OllamaPromptConfiguration };
export { claudePrompt, ClaudePromptConfiguration };

export { isSignal };
