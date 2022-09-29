const postcss = require("postcss")
const { importParser } = require("../plugins");
const schema = require("./options.json");

async function loader(source) {
    const rawOptions = this.getOptions(schema);
    const importPluginImports = []
    const importPluginApi = []
    const loaderContext = this

    const callback = this.async()

    const options = {
        imports: importPluginImports,
        api: importPluginApi,
        loaderContext,
        urlHandler(url) {
            const { importLoaders } = rawOptions
            const { loaderIndex } = loaderContext
            const loaders = loaderContext.loaders.slice(loaderIndex, 
                loaderIndex + 1 + (typeof importLoaders !== 'number' ? 0 : importLoaders))
            const loaderRequest = loaders.map( x => {
                return x.request
            }).join('!')
            const tempRequest = `-!${loaderRequest}!` + url
            const request = loaderContext.utils.contextify(loaderContext.context || loaderContext.rootContext, tempRequest)
            // console.log(999999999999)
            // console.log(loaderContext.loaders)
            // console.log(request)
            return request
        }
    }

    const plugins = [importParser(options)]
    let result
    try {
        result = await postcss(plugins).process(source)
        // console.log( result.warnings())
        // console.log( result)
        // console.log(options)
        console.log(11111111)
        console.log(options.imports)
        console.log(options.api)
        console.log(111111111)

        callback(null, result.css, result.map)
    } catch (error) {
        callback(error, result)
    }
}

module.exports = loader