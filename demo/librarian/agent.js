import { computed, effect, signal } from "@preact/signals-core";
import { isSignal } from "@paulkinlan/reactive-prompt/utils";
import {
  prompt,
  ChromePromptConfiguration,
} from "@paulkinlan/reactive-prompt/chrome";

class Command {
  static get STOP() {
    return "##STOP##";
  }
}

class BaseAgent {
  #context;
  #response;

  constructor() {
    this.#context = signal();
    this.#response = signal();
  }

  get context() {
    return this.#context;
  }

  set context(val) {
    this.#context = val;
  }

  get response() {
    return this.#response;
  }
}

class Agent extends BaseAgent {
  #persona;
  #task;

  constructor({ task, persona }) {
    super();

    this.#persona = isSignal(persona) ? persona : signal(persona);
    this.#task = isSignal(task) ? task : signal(task);

    const promptResult = computed(() => {
      const context = this.context?.value;
      if (context == undefined) {
        // Don't prompt until we have the context (there's no point.)
        return undefined;
      }

      if (context == Command.STOP) {
        return Command.STOP;
      }

      return prompt`Persona: ${this.#persona.value}

Task: ${this.#task.value}

Context: ${context}${new ChromePromptConfiguration({
        debug: true,
      })}`;
    });

    effect(() => {
      const promptResponse = promptResult.value;
      // need to remove nested signals
      if (promptResponse == undefined) {
        this.response.value = undefined;
        return;
      }

      if (promptResponse == Command.STOP) {
        // The agent has been told to stop. Pass it on.
        this.response.value = Command.STOP;
        return;
      }

      this.response.value = promptResponse.value;
    });
  }

  get persona() {
    return this.#persona;
  }

  set persona(val) {
    this.#persona = val;
  }

  get task() {
    return this.#task;
  }

  set task(val) {
    this.#task = val;
  }
}

class Human extends BaseAgent {
  constructor() {
    super();

    let response = this.response;

    effect(() => {
      const context = this.context.value;
      if (context == "" || context == undefined) {
        return;
      }

      if (context == Command.STOP) {
        response.value = Command.STOP;
        return;
      }

      response.value = window.prompt(context);
    });
  }
}

class Accumulator extends BaseAgent {
  #internalList = [];

  constructor() {
    super({ task: signal(), persona: signal() });
    effect(() => {
      const context = this.context.value;

      if (context == undefined || context == Command.STOP) {
        this.response.value = [...this.#internalList];
        this.#internalList = [];
      } else {
        // Accumulate the responses, until it's complete
        this.#internalList.push(context);
      }
    });
  }
}

function getParameterNames(func) {
  const funcString = func.toString();
  const matches = funcString.match(/\(([^)]*)\)/); // Extract parameters within parentheses

  if (matches) {
    const paramsString = matches[1];
    return paramsString.split(",").map((param) => param.trim());
  } else {
    return []; // No parameters found
  }
}

class ToolCaller extends Agent {
  #tools;
  #finalResponse;

  #extractFunctionJSON = function (code) {
    if (code == undefined || typeof code != "string") return "";
    const match = code.match(/```(.*)\n([\s\S\d\D]+)\n```/m);
    if (!match) return "";

    const language = match[1];
    const content = match[2];

    switch (language.toLowerCase()) {
      case "json":
        return JSON.parse(content);
      default:
        console.log("Unsupported language: ", language);
        return "";
    }
  };

  constructor({ tools }) {
    const toolNames = tools.map((tool) => {
      if (tool.func.name == "") throw "Tools must use a named function";

      return `
+  Function name: ${tool.func.name}
   Function arguments: ${getParameterNames(tool.func)}
   Function description: ${tool.description}`;
    });

    const persona = `You have access to the following tools: ${toolNames.join(
      "\n+ "
    )}`;
    const task = `Based on the context, decide which function to use and return a JSON object in the following format: 
  {
    function_name;
    function_args: {name, value};
  }
`;
    super({ persona, task });

    this.#finalResponse = signal();
    this.#tools = tools;

    effect(() => {
      const result = this.response.value;

      const { function_name, function_args } =
        this.#extractFunctionJSON(result);

      if (function_name == undefined || function_name == "") return;

      for (const tool of this.#tools) {
        if (tool.func.name == function_name) {
          const flattenedArgs = getParameterNames(tool.func).map(
            (argName) => function_args[argName]
          );

          // try and call the function
          this.#finalResponse.value = tool.func(...flattenedArgs);
          return;
        }
      }

      throw "Unable to find function to call";
    });
  }

  // We have to override the response. This feels like a bit of a hack because we need the response from the base class where the root prompt happens
  get response() {
    if (#finalResponse in this) {
      return this.#finalResponse;
    } else {
      return super.response;
    }
  }

  get tools() {
    return this.#tools;
  }
}

class Planner extends Agent {
  #loop;
  #extractCode = function (code) {
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

  constructor({ task, loop }) {
    const persona = `You are to create a precise plan for a given job. This plan will be executed by others and your responsibility is to produce a plan that reflects the job. 

Your output must be a valid JSON of the following format:

\`\`\`json
{
  "max": "number, optional. Specifies how many iterations to make. Useful when the job specifies the upper limit the number of items in the list.",
  "todo": [{
    "task": "string, The task description. Use action-oriented language, starting with a verb that fits the task."
  }]
  "doneMarker": "string, optional. The marker that will be used by others to signal completion."
  "error": "string, optional. A description of why you're unable to create a plan"
}
\`\`\`

There are four kinds of jobs that you can make plans for. 

1) The indefinite job. These are useful when there is not a definite completion condition, and is usually formulated with words like "indefinitely" or "forever". In such cases, the plan will look like an object without a "todo" property, with "max" set to a very large number:

\`\`\`json
{
  "max": 100000000
}
\`\`\`

2) The step-by-step job. These are for situations when a distinct, known number of tasks can be discerned from the job. For example, when asked to write chapters of a book following an outline, there's a clear list of tasks that can be discerned (one "Write <chapter title>" per chapter). 

A plan for this kind of job will look like an object with "todo" items:

\`\`\`json
{
  "todo": [
    { "task": "<action-oriented description of task 1" },
    { "task": "<action-oriented description of task 2" },
    { "task": "<action-oriented description of task 3" }
  ]
}
\`\`\`\

If the job includes a limit on how many tasks to produce, use the "max" property to indicate that. For instance, if the job contains three items that can be discerned, but asks to only do two of them:

\`\`\`json
{
  "max:" 2,
  "todo": [
    { "task": "<action-oriented description of task 1" },
    { "task": "<action-oriented description of task 2" },
    { "task": "<action-oriented description of task 3" }
  ]
}
\`\`\`

3) Just repeat the steps job. These jobs do not have a distinct tasks, but rather just a number of steps to repeat. In this case, omit the "todo" and just use "max" property:

\`\`\`json
{
  "max": 4
}
\`\`\`

4) The job where the completion is signaled by others. These are the types of jobs where the number of iterations or the exact steps are unknown, and the
completion signal is issued by those who are executing the individual steps. In such cases, use the "doneMarker" property and use the marker specified:

\`\`\`json
{
  "doneMarker": "<the marker that will be used to signal completion>"
}
\`\`\`

Common markers are "##STOP##" or "##DONE##", but could be different depending on a job. This type of the job is mutually exclusive with the step-by-step type, so the "todo" and "doneMarker" may never be specified together.

When you are unable to create plan from the job, reply with:

\`\`\`json
{
  "error": "<description of why you're unable to create a plan>"
}
\`\`\`
`;
    super({ persona, task });

    this.#loop = loop; // Should be an agent

    // We might need to destroy the effect if it's rebound.

    effect(() => {
      // Parse the response
      const response = this.response.value;
      const baseContext = this.context.value;

      if (response == undefined) return;
      if (response instanceof Object) return; // It's not a string from a model
      if (baseContext == undefined) return;

      try {
        const json = this.#extractCode(response);

        if (json == "") {
          console.error(`Unable to extract code from response: ${response}`);
          return;
        }

        if ("todo" in json == false) {
          console.error(`Unable to extract todo's from response: ${response}`);
          return;
        }

        // We can only run an agent task one at a time.
        const { todo } = json;

        let processing = false;
        // Contains the results from the next node.
        const loopResult = [];

        // nesting the effect, if the input response changes then we reset
        effect(() => {
          // This function should only be called when the loop response changes (and it only contains the direct result from loop node)
          const loopOutput = this.#loop.response.value;

          if (loopOutput == Command.STOP) {
            // The loop has been told to stop.
            this.response.value = loopResult;
            return;
          }

          if (loopOutput != undefined && processing == true) {
            processing = false;
          }

          if (todo.length == 0 && processing == false) {
            // end the task;
            loopResult.push(loopOutput);
            this.#loop.context.value = Command.STOP;
            return;
          }

          if (todo.length > 0 && processing == false) {
            if (loopOutput != undefined) {
              loopResult.push(loopOutput);
            }
            processing = true;
            const item = todo.shift();
            // Start the task.
            this.#loop.context.value = `${baseContext}

Question: ${item.task}`;
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export { Agent, Human, Planner, ToolCaller, Accumulator };
