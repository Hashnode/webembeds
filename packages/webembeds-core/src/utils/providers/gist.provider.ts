const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class GithubGist extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(a: any, b: any) {
    super(a, b);
  }

  generateOutput = () => {
    console.log("Inside github");
    const { cheerio } = this;
    const $ = cheerio.load("<script>");
    $("script").attr("src", `${this.embedURL}.js`);
    console.log($.html());
    return $.html();
  }
}

module.exports = GithubGist;
export {};
