const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class GithubGist extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(a: any, b: any) {
    super(a, b);
  }

  generateOutput = () => {
    // const snackId = "";
//     <div data-snack-id="@girishhashnode/unnamed-snack" data-snack-platform="web" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#F9F9F9;border:1px solid var(--color-border);border-radius:4px;height:505px;width:100%"></div>
// <script async src="https://snack.expo.io/embed.js"></script>
    
    console.log("Custom gist pull");
    const { cheerio } = this;
    const $ = cheerio.load("script");
    $("script").attr("src", "https://snack.expo.io/embed.js");
    return $.html();
  }
}

module.exports = GithubGist;
export {};
