const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class Instagram extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: {}) {
    super(args);
  }

  run = () => {
    console.log("Custom Instagram pull");
    const id = this.embedURL.replace("https://www.instagram.com/p/", "").trim().replace(/\//g, "");
    return `<iframe src="https://www.instagram.com/p/${id}/embed/" />`;
  }
}

module.exports = Instagram;
export {};
