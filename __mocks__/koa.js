export default class {
  use() {
    return this;
  }

  /* eslint-disable class-methods-use-this */
  listen() {
    return {
      close() {
        // stub function
      },
    };
  }
  /* eslint-enable class-methods-use-this */
}
