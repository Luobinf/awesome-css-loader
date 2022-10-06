const valueParser = require("postcss-value-parser");
const {
  WEBPACK_IGNORE_COMMENT_REGEXP,
  normalizeUrl,
  shouldHandleURL,
  requestify,
  resolveRequests
} = require("../utils");

function getNodeFromUrlFunc(node) {
  return node && node.nodes && node.nodes[0];
}

// 用于解析例如 background-image: url('./image.png');
function parseDeclaration(declaration, key, result, options) {
  const value = declaration[key];
  if (!value) {
    return;
  }
  const parsed = valueParser(value);

  // if(nodes && nodes.length === 0) {
  // 	return
  // }

  // const node = nodes[0];

  // if(node.type !== "function" || node.value !== 'url') {
  // 	return
  // }

  // console.log(88888);
  // console.log(node);
  // 例如： background-image: url();
  // if(node.nodes && node.nodes.length === 0) {
  // 	return
  // }

  // 需要验证 node.nodes.value 的合法性

  let isIgnoreDeclaration = false;

  const prevNode = declaration.prev();

  if (prevNode && prevNode.type === "comment") {
    const matched = prevNode.text.match(WEBPACK_IGNORE_COMMENT_REGEXP);
    if (matched) {
      isIgnoreDeclaration = matched[2] === "true";
    }
  }

  const parsedURLs = [];

  parsed.walk((valueNode, index, valueNodes) => {
    // for example:
    // {
    //   type: 'function',
    //   sourceIndex: 0,
    //   value: 'url',
    //   before: '',
    //   after: '',
    //   sourceEndIndex: 7,
    //   nodes: [
    //     {
    //       type: 'string',
    //       sourceIndex: 4,
    //       quote: "'",
    //       value: '',
    //       sourceEndIndex: 6
    //     }
    //   ]
    // }
    if (valueNode.type !== "function" && valueNode.value !== "url") {
      return;
    }

    const { nodes } = valueNode;

    if (nodes && nodes.length === 0) {
      return;
    }

    const isStringValue = nodes[0].type === "string";
    let url = isStringValue ? nodes[0].value : valueParser.stringify(nodes);

    url = normalizeUrl(url, isStringValue); // 对于在不同操作系统中路径处理

    console.log(`url123`);
    console.log(url);
    console.log(`url123`);

    const { requestable, needResolve } = shouldHandleURL(
      url,
      declaration,
      result,
      options
    );

    if (!requestable) {
      return false;
    }

    // 检查 url 是否是内联的。若是，需要进行特殊处理。
    const queryParts = url.split("!");
    let prefix;

    if (queryParts.length > 1) {
      url = queryParts.pop();
      prefix = queryParts.join("!");
    }

    parsedURLs.push({
      url,
      prefix,
      node: getNodeFromUrlFunc(valueNode),
      declaration,
      parsed,
      needResolve,
      needQuotes: false,
    });

    return false;
  });

  return parsedURLs;
}

module.exports = function (options = {}) {
  return {
    postcssPlugin: "postcss-url-parser",
    Once(root) {
      // Plugin code
      console.log("进来了,做点什么呢???");
    },
    prepare(result) {
      const parsedDeclarations = [];
      return {
        Declaration(declaration) {
          const parsedURL = parseDeclaration(declaration, "value", result, {});
          if (!parsedURL) {
            return;
          }
          parsedDeclarations.push(...parsedURL);
        },
        async OnceExit() {
          console.log("退出了!!");
          // console.log(parsedDeclarations);
          if (parsedDeclarations.length == 0) {
            return;
          }

          const resolvedDeclarations = await Promise.all(
            parsedDeclarations.map(async (parsedDeclaration) => {
              const { url, needResolve } = parsedDeclaration;

              // 这是做什么的？
              if (options.filter) {
                const needKeep = await options.filter(url);

                if (!needKeep) {
                  // eslint-disable-next-line consistent-return
                  return;
                }
              }

              if (!needResolve) {
                // eslint-disable-next-line consistent-return
                return parsedDeclaration;
              }

              // needResolve 为 true， 表示需要解析路径
              const splittedUrl = url.split(/(\?)?#/);
              const [pathname, query, hashOrQuery] = splittedUrl;

              let hash = query ? "?" : "";
              hash += hashOrQuery ? `#${hashOrQuery}` : "";

              // console.log(3333333333)
              // console.log(options.resolver)
              // console.log(3333333333)
              const { resolver, rootContext } = options;
              const request = requestify(
                pathname,
                rootContext,
                Boolean(resolver)
              );

              if (!resolver) {
                // eslint-disable-next-line consistent-return
                return { ...parsedDeclaration, url: request, hash };
              }

              const resolvedURL = await resolveRequests(
                resolver,
                options.context,
                [...new Set([request, url])]
              );

              if (!resolvedURL) {
                // eslint-disable-next-line consistent-return
                return;
              }

              // eslint-disable-next-line consistent-return
              return { ...parsedDeclaration, url: resolvedURL, hash };
            })
          );

          console.log(112233);
          console.log(resolvedDeclarations);
          console.log(112233);

          let hasUrlImportHelper = false;
          let urlToNameMap = new Map();
          let urlToReplacement = new Map();

          for (let i = 0; i < resolvedDeclarations.length; i++) {
            const item = resolvedDeclarations[i];
            if (!item) {
              continue;
            }

            if (!hasUrlImportHelper) {
              options.imports.push({
                type: "get_url_import",
                importName: "___CSS_LOADER_GET_URL_IMPORT___",
                url: options.urlHandler(
                  require.resolve("../runtime/getUrl.js")
                ),
                index: -1,
              });
              console.log("hello world");
              console.log(options.imports);
              console.log("hello world");

              hasUrlImportHelper = true;
            }

            const { url, prefix } = item;
            // prefix 有值，表示是行内 loader
            let newUrl = prefix ? prefix + "!" + url : url;
            let importName = urlToNameMap.get(newUrl);

            if (!importName) {
              importName = `___CSS_LOADER_URL_IMPORT_${urlToNameMap.size}___`; // 例如： ___CSS_LOADER_URL_IMPORT_0___
              urlToNameMap.set(newUrl, importName);

              options.imports.push({
                importName,
                type: "url",
                url: options.resolver
                  ? options.urlHandler(newUrl)
                  : JSON.stringify(newUrl),
                index: i,
              });
            }

            const { hash, needQuotes } = item;
            const replacementKey = JSON.stringify({ newUrl, hash, needQuotes });
            let replacementName = urlToReplacement.get(replacementKey)

            if(!replacementName) {
              replacementName = `___CSS_LOADER_URL_REPLACEMENT_${urlToReplacement.size}___`
              urlToReplacement.set(replacementKey, replacementName);

              options.replacements.push({
                replacementName,
                importName,
                hash,
                needQuotes,
              });
            }

            item.node.type = 'world'
            item.node.value = replacementName
            item.declaration.value = item.parsed.toString()   //为什么需要这么做？

          }
        },
      };
    },
  };
};

module.exports.postcss = true;


// 带有URL解析过后的代码
// Imports
// import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
// import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
// import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";
// import ___CSS_LOADER_AT_RULE_IMPORT_1___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./test.css";
// import ___CSS_LOADER_GET_URL_IMPORT___ from "../node_modules/css-loader/dist/runtime/getUrl.js";

// var ___CSS_LOADER_URL_IMPORT_0___ = new URL("./image.png", import.meta.url);
// var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(
//   ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___
// );
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_1___);

// var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(
//   ___CSS_LOADER_URL_IMPORT_0___
// );

// // Module
// ___CSS_LOADER_EXPORT___.push([
//   module.id,
//   "/* @import './index.css'; */\n\n\nhtml {\n    font-size: 20px;\n    display: -ms-flexbox;\n    display: flex;\n    background-image: url(" +
//     ___CSS_LOADER_URL_REPLACEMENT_0___ +
//     ");\n}",
//   "",
// ]);

// // Exports
// export default ___CSS_LOADER_EXPORT___;


// Imports
// var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = require("../node_modules/css-loader/dist/runtime/noSourceMaps.js");
// var ___CSS_LOADER_API_IMPORT___ = require("../node_modules/css-loader/dist/runtime/api.js");
// var ___CSS_LOADER_AT_RULE_IMPORT_0___ = require("-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css");
// var ___CSS_LOADER_AT_RULE_IMPORT_1___ = require("-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./test.css");
// var ___CSS_LOADER_GET_URL_IMPORT___ = require("../node_modules/css-loader/dist/runtime/getUrl.js");
// var ___CSS_LOADER_URL_IMPORT_0___ = require("./image.png");
// var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_1___);
// var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
// // Module
// ___CSS_LOADER_EXPORT___.push([module.id, "\n\n\nhtml {\n    font-size: 20px;\n    display: -ms-flexbox;\n    display: flex;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n}", ""]);
// // Exports
// module.exports = ___CSS_LOADER_EXPORT___;
