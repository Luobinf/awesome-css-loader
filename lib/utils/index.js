const { fileURLToPath } = require("url");
const path = require("path");

const WEBPACK_IGNORE_COMMENT_REGEXP = /webpackIgnore:(\s+)?(true|false)/;

const NATIVE_WIN32_PATH = /^[A-Z]:[/\\]|^\\\\/i;
const CONTAINS_ESCAPE = /\\/;
const IS_MODULE_REQUEST = /^[^?]*~/;
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;

async function resolveRequests(resolve, context, possibleRequests) {
  return resolve(context, possibleRequests[0])
    .then((result) => result)
    .catch((error) => {
      const [, ...tailPossibleRequests] = possibleRequests;

      if (tailPossibleRequests.length === 0) {
        throw error;
      }

      return resolveRequests(resolve, context, tailPossibleRequests);
    });
}

function urlToRequest(url, root) {
  let request;

  if (IS_NATIVE_WIN32_PATH.test(url)) {
    // absolute windows path, keep it
    request = url;
  } else if (typeof root !== "undefined" && /^\//.test(url)) {
    request = root + url;
  } else if (/^\.\.?\//.test(url)) {
    // A relative url stays
    request = url;
  } else {
    // every other url is threaded like a relative url
    request = `./${url}`;
  }

  // A `~` makes the url an module
  if (IS_MODULE_REQUEST.test(request)) {
    request = request.replace(IS_MODULE_REQUEST, "");
  }

  return request;
}

function isDataUrl(url) {
  if (/^data:/i.test(url)) {
    return true;
  }

  return false;
}

function requestify(url, rootContext, needToResolveURL = true) {
  if (needToResolveURL) {
    if (/^file:/i.test(url)) {
      return fileURLToPath(url);
    }

    return url.charAt(0) === "/"
      ? urlToRequest(url, rootContext)
      : urlToRequest(url);
  }

  if (url.charAt(0) === "/" || /^file:/i.test(url)) {
    return url;
  }

  // A `~` makes the url an module
  if (IS_MODULE_REQUEST.test(url)) {
    return url.replace(IS_MODULE_REQUEST, "");
  }

  return url;
}

function unescape(str) {
  const needToProcess = CONTAINS_ESCAPE.test(str);

  if (!needToProcess) {
    return str;
  }

  let ret = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      const gobbled = gobbleHex(str.slice(i + 1, i + 7));

      // eslint-disable-next-line no-undefined
      if (gobbled !== undefined) {
        ret += gobbled[0];
        i += gobbled[1];

        // eslint-disable-next-line no-continue
        continue;
      }

      // Retain a pair of \\ if double escaped `\\\\`
      // https://github.com/postcss/postcss-selector-parser/commit/268c9a7656fb53f543dc620aa5b73a30ec3ff20e
      if (str[i + 1] === "\\") {
        ret += "\\";
        i += 1;

        // eslint-disable-next-line no-continue
        continue;
      }

      // if \\ is at the end of the string retain it
      // https://github.com/postcss/postcss-selector-parser/commit/01a6b346e3612ce1ab20219acc26abdc259ccefb
      if (str.length === i + 1) {
        ret += str[i];
      }

      // eslint-disable-next-line no-continue
      continue;
    }

    ret += str[i];
  }

  return ret;
}

function normalizeUrl(url, isStringValue) {
  let normalizedUrl = url
    .replace(/^( |\t\n|\r\n|\r|\f)*/g, "")
    .replace(/( |\t\n|\r\n|\r|\f)*$/g, "");

  if (isStringValue && /\\(\n|\r\n|\r|\f)/.test(normalizedUrl)) {
    normalizedUrl = normalizedUrl.replace(/\\(\n|\r\n|\r|\f)/g, "");
  }

  if (NATIVE_WIN32_PATH.test(url)) {
    try {
      normalizedUrl = decodeURI(normalizedUrl);
    } catch (error) {
      // Ignore
    }

    return normalizedUrl;
  }

  normalizedUrl = unescape(normalizedUrl);

  if (isDataUrl(url)) {
    // Todo fixedEncodeURIComponent is workaround. Webpack resolver shouldn't handle "!" in dataURL
    return fixedEncodeURIComponent(normalizedUrl);
  }

  try {
    normalizedUrl = decodeURI(normalizedUrl);
  } catch (error) {
    // Ignore
  }

  return normalizedUrl;
}

function fixedEncodeURIComponent(str) {
  return str.replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
}

function isURLRequestable(url, options = {}) {
  // Protocol-relative URLs
  if (/^\/\//.test(url)) {
    return { requestable: false, needResolve: false };
  }

  // `#` URLs
  if (/^#/.test(url)) {
    return { requestable: false, needResolve: false };
  }

  // Data URI
  if (isDataUrl(url) && options.isSupportDataURL) {
    try {
      decodeURIComponent(url);
    } catch (ignoreError) {
      return { requestable: false, needResolve: false };
    }

    return { requestable: true, needResolve: false };
  }

  // `file:` protocol
  if (/^file:/i.test(url)) {
    return { requestable: true, needResolve: true };
  }

  // Absolute URLs
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !NATIVE_WIN32_PATH.test(url)) {
    if (options.isSupportAbsoluteURL && /^https?:/i.test(url)) {
      return { requestable: true, needResolve: false };
    }

    return { requestable: false, needResolve: false };
  }

  return { requestable: true, needResolve: true };
}

function shouldHandleURL(url, declaration, result, options) {
  if (url.length === 0 || url.trim() === "") {
    result.warn(`Unable to find uri in '${declaration.toString()}'`, {
      node: declaration,
    });
    return { requestable: false, needResolve: false };
  }

  return isURLRequestable(url, options);
}

const IS_MODULES = /\.module(s)?\.\w+$/i;
const IS_ICSS = /\.icss\.\w+$/i;

function getModulesOptions(rawOptions, exportType, loaderContext) {
  if (typeof rawOptions.modules === "boolean" && rawOptions.modules === false) {
    return false;
  }

  const resourcePath =
    // eslint-disable-next-line no-underscore-dangle
    (loaderContext._module && loaderContext._module.matchResource) ||
    loaderContext.resourcePath;

  let auto;
  let rawModulesOptions;

  if (typeof rawOptions.modules === "undefined") {
    rawModulesOptions = {};
    auto = true;
  } else if (typeof rawOptions.modules === "boolean") {
    rawModulesOptions = {};
  } else if (typeof rawOptions.modules === "string") {
    rawModulesOptions = { mode: rawOptions.modules };
  } else {
    rawModulesOptions = rawOptions.modules;
    ({ auto } = rawModulesOptions);
  }

  // eslint-disable-next-line no-underscore-dangle
  const { outputOptions } = loaderContext._compilation;
  const needNamedExport =
    exportType === "css-style-sheet" || exportType === "string";
  const modulesOptions = {
    auto,
    mode: "local",
    exportGlobals: false,
    localIdentName: "[hash:base64]",
    localIdentContext: loaderContext.rootContext,
    localIdentHashSalt: outputOptions.hashSalt,
    localIdentHashFunction: outputOptions.hashFunction,
    localIdentHashDigest: outputOptions.hashDigest,
    localIdentHashDigestLength: outputOptions.hashDigestLength,
    // eslint-disable-next-line no-undefined
    localIdentRegExp: undefined,
    // eslint-disable-next-line no-undefined
    getLocalIdent: undefined,
    namedExport: needNamedExport || false,
    exportLocalsConvention:
      (rawModulesOptions.namedExport === true || needNamedExport) &&
      typeof rawModulesOptions.exportLocalsConvention === "undefined"
        ? "camelCaseOnly"
        : "asIs",
    exportOnlyLocals: false,
    ...rawModulesOptions,
  };

  let exportLocalsConventionType;

  if (typeof modulesOptions.exportLocalsConvention === "string") {
    exportLocalsConventionType = modulesOptions.exportLocalsConvention;

    modulesOptions.exportLocalsConvention = (name) => {
      switch (exportLocalsConventionType) {
        case "camelCase": {
          return [name, camelCase(name)];
        }
        case "camelCaseOnly": {
          return camelCase(name);
        }
        case "dashes": {
          return [name, dashesCamelCase(name)];
        }
        case "dashesOnly": {
          return dashesCamelCase(name);
        }
        case "asIs":
        default:
          return name;
      }
    };
  }

  if (typeof modulesOptions.auto === "boolean") {
    const isModules = modulesOptions.auto && IS_MODULES.test(resourcePath);

    let isIcss;

    if (!isModules) {
      isIcss = IS_ICSS.test(resourcePath);

      if (isIcss) {
        modulesOptions.mode = "icss";
      }
    }

    if (!isModules && !isIcss) {
      return false;
    }
  } else if (modulesOptions.auto instanceof RegExp) {
    const isModules = modulesOptions.auto.test(resourcePath);

    if (!isModules) {
      return false;
    }
  } else if (typeof modulesOptions.auto === "function") {
    const isModule = modulesOptions.auto(resourcePath);

    if (!isModule) {
      return false;
    }
  }

  if (typeof modulesOptions.mode === "function") {
    modulesOptions.mode = modulesOptions.mode(loaderContext.resourcePath);
  }

  if (needNamedExport) {
    if (rawOptions.esModule === false) {
      throw new Error(
        "The 'exportType' option with the 'css-style-sheet' or 'string' value requires the 'esModules' option to be enabled"
      );
    }

    if (modulesOptions.namedExport === false) {
      throw new Error(
        "The 'exportType' option with the 'css-style-sheet' or 'string' value requires the 'modules.namedExport' option to be enabled"
      );
    }
  }

  if (modulesOptions.namedExport === true) {
    if (rawOptions.esModule === false) {
      throw new Error(
        "The 'modules.namedExport' option requires the 'esModules' option to be enabled"
      );
    }

    if (
      typeof exportLocalsConventionType === "string" &&
      exportLocalsConventionType !== "camelCaseOnly" &&
      exportLocalsConventionType !== "dashesOnly"
    ) {
      throw new Error(
        'The "modules.namedExport" option requires the "modules.exportLocalsConvention" option to be "camelCaseOnly" or "dashesOnly"'
      );
    }
  }

  return modulesOptions;
}

function getFilter(filter, resourcePath) {
  return (...args) => {
    if (typeof filter === "function") {
      return filter(...args, resourcePath);
    }

    return true;
  };
}

function sort(a, b) {
  return a.index - b.index;
}

function normalizeOptions(rawOptions, loaderContext) {
  const exportType =
    typeof rawOptions.exportType === "undefined"
      ? "array"
      : rawOptions.exportType;
  const modulesOptions = getModulesOptions(
    rawOptions,
    exportType,
    loaderContext
  );

  return {
    url: typeof rawOptions.url === "undefined" ? true : rawOptions.url,
    import: typeof rawOptions.import === "undefined" ? true : rawOptions.import,
    modules: modulesOptions,
    sourceMap:
      typeof rawOptions.sourceMap === "boolean"
        ? rawOptions.sourceMap
        : loaderContext.sourceMap,
    importLoaders:
      typeof rawOptions.importLoaders === "string"
        ? parseInt(rawOptions.importLoaders, 10)
        : rawOptions.importLoaders,
    esModule:
      typeof rawOptions.esModule === "undefined" ? true : rawOptions.esModule,
    exportType,
  };
}




function getImportCode(imports, options) {
  if (imports.length === 0) {
    return ``;
  }

  let code = ``;
  // ___CSS_LOADER_API_SOURCEMAP_IMPORT___  、___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ 需要进行路径设置

  for (let i = 0; i < imports.length; i++) {
    const rule = imports[i];
    const { importName, url, type } = rule;
    if (options.esModule) {
      code +=
        type === "url"
          ? `var ${importName} = new URL(${url}, import.meta.url);\n`
          : `import ${importName} from ${url};\n`;
    } else {
      code += `var ${importName} = require (${url});\n`;
    }
  }

  return code ? `// Imports\n${code}` : "";
}



function getModuleCode(result, api, replacements, options) {
  const { sourceMap } = options;
  let code = JSON.stringify(result.css);

  // ___CSS_LOADER_EXPORT___ 实际内容为数组
  let beforeCode = `var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(${
    sourceMap
      ? "___CSS_LOADER_API_SOURCEMAP_IMPORT___"
      : "___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___"
  });\n`;

  // 将css文件中 @import 过来的文件 存入到 ___CSS_LOADER_EXPORT___ 数组中
  for (let i = 0; i < api.length; i++) {
    const rule = api[i];
    const { importName } = rule;
    beforeCode += `___CSS_LOADER_EXPORT___.i(${importName}, "");\n`;
  }

  // 处理 url 语法
  for (let item of replacements) {
    // var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
    const { replacementName, importName, hash, needQuotes } = item;

    const getUrlOptions = []
      .concat(hash ? [`hash: ${JSON.stringify(hash)}`] : [])
      .concat(needQuotes ? "needQuotes: true" : []);
    const preparedOptions =
      getUrlOptions.length > 0 ? `, { ${getUrlOptions.join(", ")} }` : "";

    beforeCode += `var ${replacementName} = ___CSS_LOADER_GET_URL_IMPORT___(${importName}${preparedOptions});\n`;

    // 将postcss解析过后的url代码进行名字替换
    // ___CSS_LOADER_EXPORT___.push([
    //   module.id,
    //   "/* @import './index.css'; */\n\n\nhtml {\n    font-size: 20px;\n    display: -ms-flexbox;\n    display: flex;\n    background-image: url(" +
    //     ___CSS_LOADER_URL_REPLACEMENT_0___ +
    //     ");\n}",
    //   "",
    // ]);
    code = code.replace(
      new RegExp(replacementName, "g"),
      () => `" + ${replacementName} + "`
    );
  }

  // Indexes description:
  // 0 - module id
  // 1 - CSS code
  // 2 - media
  // 3 - source map
  // 4 - supports
  // 5 - layer
  // css文件中不属于 @import 的代码部分
  return `${beforeCode}// Module\n___CSS_LOADER_EXPORT___.push([module.id, ${code}, ""]);\n\n`;
}

function getExportCode(options) {
  let code = `${
    options.esModule ? "export default" : "module.exports = "
  } ___CSS_LOADER_EXPORT___;\n`;

  return code;
}

function shouldUseImportPlugin(options) {
  if (options.import === false) {
    return false;
  }
  return true;
}

function shouldUseURLPlugin(options) {
  if (options.url === false) {
    return false;
  }
  return true;
}

// CSS-LOADER 最终解析出来的代码长下面这样
// Imports
// import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
// import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
// import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";
// import ___CSS_LOADER_AT_RULE_IMPORT_1___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./test.css";

// var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);   // 返回一个数组 list
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_0___);  // ___CSS_LOADER_AT_RULE_IMPORT_0___ 的结果为数组。
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_1___);  // ___CSS_LOADER_AT_RULE_IMPORT_1___ 的结果为数组。
// // Module
// ___CSS_LOADER_EXPORT___.push([module.id, "html {\n    font-size: 20px;\n    display: -ms-flexbox;\n    display: flex;\n}", ""]);

// //最终 ___CSS_LOADER_EXPORT___ 为一个二维数组
// // Exports
// module.exports  ___CSS_LOADER_EXPORT___;

// ___CSS_LOADER_EXPORT___ 为二维数组

module.exports = {
  normalizeUrl,
  isURLRequestable,
  requestify,
  resolveRequests,
  getImportCode,
  getModuleCode,
  getExportCode,
  shouldUseImportPlugin,
  shouldUseURLPlugin,
  WEBPACK_IGNORE_COMMENT_REGEXP,
  shouldHandleURL,
  normalizeOptions,
  getFilter,
  sort,
};



