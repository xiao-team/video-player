// webpack.base.js
// 存放 dev 和 prod 通用配置
const { resolve } = require('path');
module.exports = {
    entry: {
        index: './src/server.ts', //入口
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 5000,
                            // 分离图片至imgs文件夹
                            name: 'imgs/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts'],
        alias: {
            '@': resolve('src'),
        },
    },
};
