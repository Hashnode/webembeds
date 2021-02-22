# webembeds-core (⚠️ Not stable yet)
Current version : 0.0.1

Built and supported by [Hashnode](https://hashnode.com)

- Checkout demo here https://webembeds.com

This is the core package that deals with the whole embedding flow.
The build file can be imported elsewhere and used directly

**Example**:

```js
const webembed = require("../build/bundle");
(async function () {
  try {
    const url = links.expo;
    const output = await webembed.default("https://www.youtube.com/watch?v=32I0Qso4sDg");
    console.log("Embed output", output);
  } catch (error) {
    console.log(error);
  }
}());
```

## TODO
[-] Add minimal tests to make sure embeds are working fine. (WIP)

## Future plans
[-] Ship `@webembeds/core` as a separate npm package.


## Contributing
Please check this README.md on instructions to contributing. https://github.com/Hashnode/webembeds/blob/master/README.md
