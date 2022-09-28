let { getOptions } = require("loader-utils");
const postcss = require("postcss");
const Tokenizer = require("css-selector-tokenizer");

function loader(source) {
  const callback = this.async();
  let loaderOptions = getOptions(this) || {};
  let options = {
    imports: [],
  };
  const cssPlugin = () => {
    return (root) => {
      // 删除所有的 @import，把导入的 css 文件路径添加到 imports 数组中。
      root.walkAtRules(/^import$/i, (rule) => {
        console.log(rule);
        rule.remove(); // 在 css 脚本中把@import 删除
        options.imports.push(rule.params.slice(1, -11));
      });
    };
  };
  postcss([cssPlugin(options)])
    .process(source)
    .then((result) => {

      let script = `
        var list = [];
        list.toString = function () {return this.join('')}
        list.push(require('./xxx.css'))
        list.push(\`${result.css}\`);
        module.exports = list.toString();
        `;
      callback(null, script);
    });
}

module.exports = loader;


/**
 * 什么代码是在什么时候执行的？
 * css-loader 是在 webpack 处理的 index.js中的 css依赖处理的
 */

// importLoaders： 0。在处理导入的资源的时候需要经过几个前置 loader 处理。



