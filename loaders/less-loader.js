const less = require('less');

function lessLoader(source) {
    const callback = this.async()
    less.render(source, () => {
        // callback
    })
}

module.exports = lessLoader