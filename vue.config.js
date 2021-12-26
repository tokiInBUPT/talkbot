/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
    publicPath: '.',
    filenameHashing: false,
    css: {
        extract: false,
    },
    transpileDependencies: ['vue-beautiful-chat'],
    chainWebpack: (config) => {
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
        config.plugin('monaco-editor').use(MonacoEditorPlugin, [
            {
                languages: ['javascript'],
            },
        ])
        if (process.env.NODE_ENV === 'production') {
            // 单文件编译
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                },
            })
            config.plugin('limitchunk').use(
                new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: 1,
                }),
            )
            config.module
                .rule('images')
                .use('url-loader')
                .loader('url-loader')
                .tap((options) => Object.assign(options, { limit: 2000000 }))
            config.module
                .rule('fonts')
                .use('url-loader')
                .loader('url-loader')
                .tap((options) => Object.assign(options, { limit: 2000000 }))
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .before('copy')
                .use('script-ext-html-webpack-plugin', [
                    {
                        inline: [/app\.js$/],
                    },
                ])

            config.plugin('FaviconBase64Plugin').use({
                pluginName: 'FaviconBase64Plugin',
                iconMatch: [],
                apply: function (compiler) {
                    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
                        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
                            this.pluginName,
                            (htmlPluginData, cb) => {
                                const iconMatch = htmlPluginData.html.match(/<link rel="icon" href="([^"]+)"\/?>/)
                                if (iconMatch[0] && iconMatch[1]) {
                                    this.iconMatch.push({
                                        html: htmlPluginData.outputName,
                                        match: iconMatch,
                                    })
                                }
                                cb(null, htmlPluginData)
                            },
                        )
                    })
                    compiler.hooks.emit.tapAsync(this.pluginName, (compilation, cb) => {
                        if (this.iconMatch.length > 0) {
                            this.iconMatch.forEach((iconMatch) => {
                                const iconPath = iconMatch.match[1].replace(compilation.options.output.publicPath, '')
                                if (compilation.assets[iconPath] && compilation.assets[iconMatch.html]) {
                                    const iconData = compilation.assets[iconPath].source()
                                    const iconExt = iconPath.split('.').pop()
                                    const mimeType = iconExt === 'ico' ? 'image/x-icon' : `image/${iconExt}`
                                    const iconBase64 = `data:${mimeType};base64,${iconData.toString('base64')}`
                                    let htmlData = compilation.assets[iconMatch.html].source().toString()
                                    htmlData = htmlData.replace(
                                        iconMatch.match[0],
                                        `<link rel="icon" href="${iconBase64}" />`,
                                    )
                                    compilation.assets[iconMatch.html] = {
                                        source: () => htmlData,
                                        size: () => htmlData.length,
                                    }
                                    delete compilation.assets[iconPath]
                                }
                            })
                        }
                        cb()
                    })
                },
            })
        }
    },
}
