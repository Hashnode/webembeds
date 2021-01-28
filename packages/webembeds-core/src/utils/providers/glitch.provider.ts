const Platform = require("../../modules/Platform.ts");
const { wrapHTML } = require("../html.utils.ts");

class Glitch extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: {}) {
    super(args);
  }

  // <iframe
  //   src="https://glitch.com/embed/#!/embed/remote-hands?path=README.md&previewSize=100"
  //   title="remote-hands on Glitch"
  //   allow="geolocation; microphone; camera; midi; vr; encrypted-media"
  //   style="height: 100%; width: 100%; border: 0;">
  // </iframe>

  // https://glitch.com/embed/#!/embed/remote-hands?path=README.md&previewSize=100
  // https://glitch.com/edit/#!/remote-hands?path=README.md%3A1%3A0
  // https://glitch.com/embed/#!/embed/remote-hands?previewSize=100&previewFirst=true&sidebarCollapsed=true
  run = (): string | null => {
    console.log(this.embedURL.replace("/edit/", "/embed/#!/embed/"));
    return `<iframe src="${this.embedURL.replace("/edit/", "/embed/#!/embed/")}" />`;
  }
}

module.exports = Glitch;
export {};
