import { signal, effect, batch } from "@preact/signals-core";
import { prompt } from "@paulkinlan/reactive-prompt/chrome";

onload = async () => {
  const submit = document.getElementById("submit");
  const output = document.getElementById("output");
  const input = document.getElementById("input");

  const nameSignal = signal("");

  const prompterSignal = prompt`Using "${nameSignal}", extract the following data:

+ First name
+ Surname
+ Date of Birth

Return as valid JSON
"`;

  const uiBuilderSignal = prompt`You are an expert web developer, and you have been tasked with creating a form for a client. The form should have the following fields: "${prompterSignal}".

Return the required HTML for the form only and populate the default values.`;

  effect(() => {
    const val = uiBuilderSignal.value;
    output.innerHTML = parseCodeFromMarkdown(val);
  });

  submit.onclick = () => {
    nameSignal.value = input.value;
  };
};

const parseCodeFromMarkdown = (code) => {
  if (code == undefined) return "";
  const match = code.match(/```(.*)\n([\s\S\d\D]+)\n```/m);
  if (!match) return "";

  const language = match[1];
  const content = match[2];

  switch (language.toLowerCase()) {
    case "json":
      return JSON.parse(content);
    case "html":
      return content;
    default:
      console.log("Unsupported language: ", language);
      return "";
  }
};
