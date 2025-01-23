export class PromptConfiguration {
  debug = false;
  type = Symbol("prompt-configuration");

  constructor({ debug }) {
    this.debug = debug;
  }

  get debug() {
    return this.debug;
  }

  set debug(value) {
    this.debug = value;
  }

  get type() {
    return this.type;
  }
}

export const isConfiguration = (configuration) => {
  return (
    configuration instanceof PromptConfiguration ||
    (configuration.type != undefined &&
      typeof configuration.type === "symbol" &&
      Symbol.keyFor(configuration.type) === "prompt-configuration")
  );
};
