const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class GithubGist extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(a: any, b: any) {
    super(a, b);
  }

  generateOutput = () => {
    console.log("Custom gist pull");
    const { cheerio } = this;
    const $ = cheerio.load("<script>");
    $("script").attr("src", `${this.embedURL}.js`);
    return $.html();
  }
}

module.exports = GithubGist;
export {};
