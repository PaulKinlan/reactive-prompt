import { signal, effect, batch, computed } from "@preact/signals-core";

// A prompt template builder
function compile(strings, ...values) {
  const session = model.createTextSession();

  return computed(async () => {
    const result = [strings[0]];
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let value = values[valueIdx];
      if (
        "brand" in value &&
        typeof value.brand === "symbol" &&
        Symbol.keyFor(value.brand) === "preact-signals"
      ) {
        value = value.value;
      }
      result.push(await value, strings[valueIdx + 1]);
    }
    return session.then((_) => _.prompt(result.join("")));
  });
}

onload = () => {
  const submit = document.getElementById("submit");
  const output = document.getElementById("output");
  const input = document.getElementById("input");

  const nameSignal = signal("");

  const prompterSignal = compile`Using "${nameSignal}", extract the following data:

+ First name
+ Surname
+ Date of Birth

Return as valid JSON
"`;

  const uiBuilderSignal = compile`You are an expert web developer, and you have been tasked with creating a form for a client. The form should have the following fields: "${prompterSignal}".

Return the required HTML for the form only and populate the default values.`;

  effect(async () => {
    const val = await uiBuilderSignal.value;
    output.innerHTML = parseCodeFromMarkdown(val);
  });

  submit.onclick = async () => {
    batch(() => {
      nameSignal.value = input.value;
    });
  };
};

const parseCodeFromMarkdown = (code) => {
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
