const { fileURLToPath } = require('url')

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

module.exports = {
  normalizeUrl,
  isURLRequestable,
  requestify,
  resolveRequests
};
