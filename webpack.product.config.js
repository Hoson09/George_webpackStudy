const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.[hash].js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
    module: {
        rules: [{
            test: /\.(png|svg|jpg|gif|jpeg)$/,
            use: [{
                    loader: 'url-loader', // 根据图片大小，把图片优化成base64
                    options: {
                        limit: 10000
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        }, {
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
                                require('autoprefixer')({ browsers: ['> 0.15% in CN'] }) // 添加前缀
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
        new MiniCssExtractPlugin({ //提取css文件的
            filename: '[name][hash].css', // 设置最终输出的文件名 //带哈希的原因是为了避免缓存的问题。
            chunkFilename: '[id][hash].css'
        }), new HtmlWebpackPlugin({
            title: 'George', // 默认值：Webpack App
            filename: 'main.html', // 输出到dist的html文件名  默认值：'index.html'
            template: path.resolve(__dirname, 'src/main.html'), //指定的模板
            minify: {
                collapseWhitespace: true, //折叠空白
                removeComments: true, //移除注释
                removeAttributeQuotes: true // 移除属性的引号
            }
        }), new CleanWebpackPlugin()
    ]
};