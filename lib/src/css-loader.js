const postcss = require("postcss")
const { importParser } = require("../plugins");

async function loader(source) {
    const callback = this.async()
    const options = {
        import: []
    }
    const plugins = [importParser(options)]

    try {
        const result = await postcss(plugins).process(source)
        // console.log( result.warnings())
        console.log( result)
        console.log(options)
        callback(null, result.css, result.map)
    } catch (error) {
        
    }
}

module.exports = loader