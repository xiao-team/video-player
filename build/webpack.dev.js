// webpack.dev.js
// 存放 dev 配置
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.base.js')
const path = require('path')
const open = require('opn') //打开浏览器
const chalk = require('chalk') // 改变命令行中输出日志颜色插件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        // 开发服务器
        contentBase: '../dist',
        host: '0.0.0.0',
        overlay: true,
        stats: 'errors-only',
        // https: true,
        after() {
            open('http://localhost:' + this.port)
                .then(() => {
                    console.log(
                        chalk.cyan(
                            '成功打开链接： http://localhost:' + this.port
                        )
                    )
                })
                .catch(err => {
                    console.log(chalk.red(err))
                })
        },
        historyApiFallback: {
            rewrites: [{ from: /./, to: '/index.html' }],
        },
    },
    output: {
        // 输出
        filename: 'js/[name].[hash].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist'),
    },
    module: {},
    plugins: [
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
        }),
        new FriendlyErrorsWebpackPlugin(),
    ],
    mode: 'development',
})
