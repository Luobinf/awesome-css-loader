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
