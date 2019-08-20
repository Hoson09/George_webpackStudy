const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.json', '.vue'], //模块化引入js，json，vue文件的时候可以不用添加后缀，直接引进文件名即可。extensions 是添加增加的意思
        alias: { //配置别名.
            '@': path.resolve(__dirname, 'src/') //@代表根目录下的src文件夹内部的地址。@ === /src/
        }
    },
    externals: { //外部的意思,这个属性可以把一个模块做成外部依赖，不会打包到你的output指定的js文件中去。
        jquery: 'jQuery',
        // Lodash: 'lodash'
    },
    module: {
        rules: [{
            // 使用'transform-runtime' 插件告诉 babel 要引用 runtime 来代替注入。
            test: /\.js$/,
            exclude: /(node_modules)/, // 加快编译速度，不包含node_modules文件夹内容
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true //转码时先读取内存，然后在转码，提高效率
                }
            }, {
                loader: "eslint-loader",
                options: {
                    // eslint options (if necessary)
                    fix: true
                }
            }]
        }, {
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
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'George', // 默认值：Webpack App
            filename: 'main.html', // 输出到dist的html文件名  默认值：'index.html'
            template: path.resolve(__dirname, 'src/main.html'), //指定的模板
            minify: {
                collapseWhitespace: true, //折叠空白
                removeComments: true, //移除注释
                removeAttributeQuotes: true // 移除属性的引号
            }
        }), new CleanWebpackPlugin() //清理
    ]
};