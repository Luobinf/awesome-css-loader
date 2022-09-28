function loader(source) {
    const res = JSON.stringify(source)
    return `module.exports = ${res}`
}

module.exports = loader;