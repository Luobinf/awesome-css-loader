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



## CSS-LOADER 思路













