module.exports = (options) => {
  return {
    postcssPlugin: "postcss-import-parser",
    Once(root) {
      // Plugin code
      console.log("进来了");
    },
    AtRule: {
      import(atAult) {
        console.log(`111`);
        console.log(atAult);
        console.log(`111`);
      },
    },
  };
};

module.exports.postcss = true;
