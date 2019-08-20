const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common');
let prodConfig = {
    mode: 'production',
    output: {
        filename: 'main.[hash].js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
    module: {
        rules: [{
            test: /\.(sc|c|sa)ss$/,
            use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: loader => [
                                require('autoprefixer')() // 添加前缀
                            ]
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ] //处理顺序从右向左进行
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({ //压缩提取css文件的
            filename: '[name][hash].css', // 设置最终输出的文件名 //带哈希的原因是为了避免缓存的问题。
            chunkFilename: '[id][hash].css'
        })
    ],
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({}) //压缩css插件
            , new UglifyJsPlugin({ //压缩js
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    }
};

module.exports = merge(common, prodConfig);