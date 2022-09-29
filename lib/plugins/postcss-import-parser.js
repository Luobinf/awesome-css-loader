const valueParser = require("postcss-value-parser");
const { isURLRequestable, resolveRequests, requestify} = require("../utils");

// @import ''; @import ; @import file;
// @import './global.css' p {color: red;}
function parseNode(atRule, key, options = {}) {
  // console.log(111111111);
  // console.log(atAult);
  // console.log(111111111);

  if (atRule.parent.type !== "root") {
    const error = new Error(`@import只能用于最顶级!`);
    error.node = atRule;
    throw error;
  }
  // Nodes节点不应该存在，例如：@import './global.css' p {color: red;}
  if (atRule.nodes) {
    const error = new Error(
      `@import 语句没有以正确的方式结尾，包含了子节点，请仔细检查!`
    );
    error.node = atRule;
    throw error;
  }

  const params = atRule[key];
  const { nodes: paramsNodes } = valueParser(params);
  // console.log(22222222222222);
  // console.log(paramsNodes);

  // type error: @import file;
  // No Nodes:  @import ;
  if (
    paramsNodes.length === 0 ||
    (paramsNodes[0].type !== "string" && paramsNodes[0].type !== "function")
  ) {
    const error = new Error(`Unable to find uri in "${atRule.toString()}"`);
    error.node = atRule;
    throw error;
  }

  let isStringValue = false;
  let url;

  if (paramsNodes[0].type === "string") {
    isStringValue = true;
    url = paramsNodes[0].value;
  } else {
    // @import nourl('./xx.css');
    if (paramsNodes[0].value.toLowerCase() !== "url") {
      const error = new Error(`Unable to find uri in "${atRule.toString()}"`);
      error.node = atRule;
      throw error;
    }
    isStringValue =
      paramsNodes[0].nodes.length !== 0 &&
      paramsNodes[0].nodes[0].type === "string";
    url = isStringValue
      ? paramsNodes[0].nodes[0].value
      : valueParser.stringify(paramsNodes[0].nodes);

    //  url = normalizeUrl(url, isStringValue);  用不上
  }

  const { requestable, needResolve } = isURLRequestable(url);

  let prefix;
  // 用于解析url，有可能 url 是一个行内 loader。例如：url = '!css-loader/cjs.js!./test.css'
  if (requestable && needResolve) {
    const queryParts = url.split("!");

    if (queryParts.length > 1) {
      url = queryParts.pop();
      prefix = queryParts.join("!");
    }
  }

  // Empty url - `@import "    ";` or `@import url();`
  if (url.trim().length === 0) {
    const error = new Error(`Unable to find uri in "${atRule.toString()}"`);
    error.node = atRule;
    throw error;
  }

  // console.log(`newurl`);
  // console.log(requestable, needResolve);
  // console.log(`newurl`);

  return {
    atRule,
    url,
    prefix,
    requestable,
    needResolve,
  };
}

module.exports = (options) => {
  return {
    postcssPlugin: "postcss-import-parser",
    Once(root) {
      // Plugin code
      console.log("进来了");
    },
    prepare(result) {
      const parsedAtRules = [];
      return {
        AtRule: {
          import(atRule) {
            let parsedAtRule;
            try {
              // 这里需要验证 atRule.params 的合法性
              parsedAtRule = parseNode(atRule, "params");
            } catch (error) {
              result.warn(error.message, { node: error.node });
            }

            // console.log(`3333333333`);
            // console.log(parsedAtRule);

            if (!parsedAtRule) {
              return;
            }
            parsedAtRules.push(parsedAtRule);
          },
        },
        async OnceExit(atRule) {
          const { loaderContext } = options;

          // 用于解析路径，并将路径设置为依赖追踪项。
          const resolver = loaderContext.getResolve({
            dependencyType: "css",
            conditionNames: ["style"],
            mainFields: ["css", "style", "main", "..."],
            mainFiles: ["index", "..."],
            extensions: [".css", "..."],
            preferRelative: true,
          });

          // console.log(222);
          // console.log(resolver)
          // console.log(222);

          // console.log(`parsedAtRules`);
          // console.log(parsedAtRules);
          // console.log(`parsedAtRules`);

          const resolvedAtRules = await Promise.all(
            parsedAtRules.map(async (parsedAtRule) => {
              const {
                atRule,
                requestable,
                needResolve,
                prefix,
                url,
                layer,
                supports,
                media,
              } = parsedAtRule;

              if (options.filter) {
                const needKeep = await options.filter(
                  url,
                  media,
                  loaderContext.resourcePath,
                  supports,
                  layer
                );

                if (!needKeep) {
                  return;
                }
              }

              if (needResolve) {
                const request = requestify(url, loaderContext.rootContext);
                const resolvedUrl = await resolveRequests(
                  resolver,
                  loaderContext.context,
                  [...new Set([request, url])]
                );

                if (!resolvedUrl) {
                  return;
                }

                if (resolvedUrl === loaderContext.resourcePath) {
                  atRule.remove();

                  return;
                }

                atRule.remove();

                // eslint-disable-next-line consistent-return
                return {
                  url: resolvedUrl,
                  layer,
                  supports,
                  media,
                  prefix,
                  requestable,
                };
              }

              atRule.remove();

              // eslint-disable-next-line consistent-return
              return { url, layer, supports, media, prefix, requestable };
            })
          );
          
          console.log(`resolvedAtRules`)
          console.log(resolvedAtRules)
          console.log(`resolvedAtRules`)

          const urlToNameMap = new Map();

          for(let index = 0; index < resolvedAtRules.length; index++) {
            const resolvedAtRule = resolvedAtRules[index]
            if(!resolvedAtRule) {
              continue
            }

            const { url, requestable } = resolvedAtRule

            if(!requestable) {
              options.api.push({
                url, layer,
                supports,
                media,index
              })
            }


            // prefix 有值表示是一个 行内 loader
            const { prefix } = resolvedAtRule;
            const newUrl = prefix ? `${prefix}!${url}` : url;
            let importName = urlToNameMap.get(newUrl);

            if(!importName) {
              importName = `__CSS_LOADER_AT_RULE_IMPORT_${urlToNameMap.size}__`;
              options.imports.push({
                type: 'rule_import',
                importName,
                url: options.urlHandler(newUrl),   // 路径解析
                index
              })
              urlToNameMap.set(newUrl, importName)
            }

            options.api.push({
              importName,
              index
            })
          }
        },
      };
    },
    OnceExit(root) {},
  };
};

module.exports.postcss = true;
