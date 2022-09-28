// 获取到样式之后，创建一个style 标签，并插入到一个页面中
const stringifyRequest = require('./utils.js')

const styleLoader = () => {}


styleLoader.pitch = (remainingRequest, previousRequest, data) => {
    // !! 只要行内 loader ，不需要webpack 中的配置项了。
    let style = `
        let style = document.createElement('style')
        let content = require(${ stringifyRequest(this,  '!!' + remainingRequest)})
        content = content.toString()
        style.innerHTML = content
        document.head.appendChild(style)
    `
    return style
}

module.exports = styleLoader
