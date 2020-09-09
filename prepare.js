function getBlock() {
  let dynamicInclude = [];
  let dynamicMap = "";

  const fs = require("fs");
  let types = [];
  let blocks = {};
  let modules = fs.readdirSync("node_modules/@luwfy");
  modules = modules.filter((el) => el.includes("luwfy-block"));
  modules.forEach((name) => {
    let pack = JSON.parse(
      fs
        .readFileSync("node_modules/@luwfy/" + name + "/package.json")
        .toString()
    );
    if (pack.luwfy) {
      for (let i of Object.keys(pack.luwfy.blocks)) {
        dynamicInclude.push(
          "import { " + pack.luwfy.blocks[i] + " } from '@luwfy/" + name + "';"
        );

        dynamicMap += '"' + i + '":' + pack.luwfy.blocks[i] + ",\n";
        //dynamicMap[i] = pack.luwfy.blocks[i];

        fs.writeFileSync(
          "./src/app/dynamicLoader.ts",
          dynamicInclude.join("\n") +
            "\n\nexport var blocksLuwfy = { " +
            dynamicMap +
            "}"
        );
      }
    }
  });
}
getBlock();
