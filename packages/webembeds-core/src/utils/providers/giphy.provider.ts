const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class Giphy extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: {}) {
    super(args);
  }

  run = () => {
    console.log("Custom Giphy pull");
    console.log(this.response.data);
    return "sd";
    // const { cheerio } = this;
    // const $ = cheerio.load("<script>");
    // $("script").attr("src", `${this.embedURL}.js`);
    // return $.html();
  }
}

module.exports = Giphy;
export {};
