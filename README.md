# css-loader 总体思路

css-loader 主要用于解析css中的 url、import 语法。

查看源码，我们可以发现 css-loader 对符合 webpack rule 条件的文件会解析成如下这样并最终返回给 webpack：

**原配置：**

**1、webpack.config.js 文件内容如下：**

```JS
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          "to-string-loader",
          {
            loader: 'css-loader',
            options: {
            //   importLoaders: 1
            },
          },
          {
            loader: 'postcss-loader',       
          }
        ],
        include: path.resolve("src"),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```


**2、src/index.js 文件内容如下：**

```JS
const css = require("./index.css");
console.log(css);
```

**3、src/index.css 文件内容如下：**

```CSS
@import './global.css';

body {
    display: flex; 
    height: 200px;
    color: red;
    background-image:  url('./image.png');
}
```

**4、src/global.css 文件内容如下：**

```CSS
* {
    box-sizing: border-box;
}
```

**通过如上配置， 入口文件 src/index.js 经过 css-loader 解析后，返回给 webpack 的内容如下：**

```JS
// Imports
import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";

var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_0___);

// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\n    color: red;\n    display: -ms-flexbox;\n    display: flex; \n    height: 200px;\n}\n", ""]);

// Exports
export default ___CSS_LOADER_EXPORT___;
```


**随后，webpack 解析上述代码遇到如下代码时：**


```JS
import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";
```


**会将 global.css 文件会经过postcss-loader、css-loader处理后返回如下形式：**

```JS
// Imports
import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";

var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);

// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n    box-sizing: border-box;\n}", ""]);

// Exports
export default ___CSS_LOADER_EXPORT___;
```

**此时 `__CSS_LOADER_AT_RULE_IMPORT_0__` 实际上为上述代码的 `___CSS_LOADER_EXPORT___` 内容**



**根据css-loader解析后的代码我们可以知道：**


`css-loader` 导出的内容是一个 `css` 数组形式的对象。`css-loader` 在解析 index.css 文件时，遇到 `@import './global.css';` 的语法时，会解析成 `import xx from '-!xx.js!yy.js!global.css';`的行内 loader 形式。


1. 对于 `import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";` 查看 `noSourceMaps.js` 文件内容可知，其导出的内容如下，作用是返回数组中的第 2 项内容。

```JS
function (item) {
    return item[1]
}
```


2. 对于 `import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";` 查看 `api.js` 文件内容可知，其导出的内容如下。

导出对象为一个函数，入参也为函数。该导出函数调用之后返回 `list` 数组，该数组挂载了 `i` 方法，并且重写了数组的 `toString` 方法。`i` 方法主要用于将内容转化成数组的形式存入到 `list` 数组中, `toString` 方法用于将 `i` 方法存入的数组遍历经过 `cssWithMappingToString` 方法拿到具体的内容后进行连接再返回。

```JS
// 内容经过一定处理，已去除次要部分。
module.exports = function (cssWithMappingToString) {
  let list = [];

  // import a list of modules into the list
  list.toString = function toString() {
    return this.map((item) => {
      let content = cssWithMappingToString(item);
      return content;
    }).join("");
  };

  list.i = function i(modules) {

    if(typeof modules === 'string') {
        modules = [[null, modules, undefined]]
    }

    for(let i = 0; i < modules.length; i++) {
        const item = [].concat(modules[i]);
        list.push(item)
    }
  };

  return list;
};
```

3. 最终导出的内容为 `___CSS_LOADER_EXPORT___`。经过步骤 2 可知，`___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);` 返回的是一个数组， 且 `___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___` 为步骤 1 的内容。

`___CSS_LOADER_EXPORT___.i(__CSS_LOADER_AT_RULE_IMPORT_0__, "");` 即通过步骤 2 所说的 `i` 方法将内容传入到 `list` 数组中.。



最后，在 `___CSS_LOADER_EXPORT___` 数组中通过 `push` 方法存入 `src/index.css` 文件的剩余内容。

实际上，`src/index.css` 最终的 `___CSS_LOADER_EXPORT___` 的内容为：


[![x3ftVU.png](https://s1.ax1x.com/2022/10/07/x3ftVU.png)](https://imgse.com/i/x3ftVU)


从上可见，数组共有两项内容，第一项为 `src/index.css`文件中导入的 `src/global.css` 文件内容，并已经将 `css` 内容解析完成。第二项内容为 `src/index.css` 文件的去除导入文件之后的内容。且包含 `i、toString()` 方法。


**css-loader 返回给 webpack 的内容是 JS 模块，我们对返回内容调用 `toString` 方法，可以获取到 `css` 内容。同样的，对 url 的解析也是如此。**

### css-loader 是如何识别 css 中的 @import、url 语法？

通过 postcss 将 css 文件解析成 AST，在 AST 中找出符合 @import、url 的节点。


## css-loader options

1、importLoaders: 在处理导入的 CSS 的时候，需要经过几个前置 loader 的处理。
2、import
3、url
4、esModule
5、module：是否开启css module功能，若开启，css-loader 解析的内容则会导出一个单独的对象，可以通过 xx.className 的方式进行使用。



loader 分两种
1、最左侧的loader 返回给 webpack 的内容一定是 js 内容，并且可以用 require 加载处理得到导出对象。
2、非最左侧的，可以是任意内容，只要它下家 loader 可以识别该 loader 导出的内容即可。


css-loader 返回的字符串给 style-loader的话，style-loader 不用 pitch 用 normal 也可以处理但是需要使用 eval 函数去执行得到 css-loader 的导出对象。

## css-loader 分析打包之后的代码


## less-loader

在执行 less-loader 的时候，编译less的时候可以自动处理@import './less', 但不会处理 @import './css'。

## postcss

用于转换 css 


i 函数。为了 import 用。


### this.addDependency()

如果此 loader 依赖的文件或文件夹发生改变之后，缓存会失效，需要重新转换。


style-loader  css-loader  postcss-loader  less-loader



less 文件中可以导入css、less文件，less-loader 会自动处理这两种类型的文件。

css 文件


importLoaders 属性用法详见 webpack.config.js 配置文件。

















