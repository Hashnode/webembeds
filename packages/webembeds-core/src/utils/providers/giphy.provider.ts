const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class Giphy extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: {}) {
    super(args);
  }

  run = async () => {
    console.log("Custom Giphy pull");
    console.log(this.response.data);
    const data = await super.run();
    console.log("as", data);
    return `<iframe src="${data}" />`;
  }
}

module.exports = Giphy;
export {};
