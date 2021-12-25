/* eslint-disable @typescript-eslint/no-var-requires */
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
    transpileDependencies: ['vue-beautiful-chat'],
    chainWebpack: (config) => {
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
        config.plugin('monaco-editor').use(MonacoEditorPlugin, [
            {
                languages: ['json'],
            },
        ])
    },
}
