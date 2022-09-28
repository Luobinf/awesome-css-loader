module.exports = (options) => {
  return {
    postcssPlugin: "postcss-import-parser",
    Once(root) {
      // Plugin code
      console.log("进来了");
    },
    AtRule: {
      import(atAult) {
        // console.log(atAult)
        // options.import.push(atAult.params.slice(1, -1))
        let value = atAult.params
        // 这里需要验证value的合法性
        atAult.remove()
        console.log(111)
        console.log(atAult.params)
      },
    },
    OnceExit(root) {
        
    }
  };
};

module.exports.postcss = true;
