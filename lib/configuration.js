export class PromptConfiguration {
  #debug = false;

  constructor({ debug }) {
    this.#debug = debug;
  }

  get debug() {
    return this.#debug;
  }

  set debug(value) {
    this.#debug = value;
  }
}
