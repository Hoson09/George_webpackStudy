const path = require('path');
module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'main.js',
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
            }]
        }, {
            test: /\.(sc|c|sa)ss$/,
            use: [{
                    loader: "style-loader"
                }, {
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
                }] //处理顺序从右向左进行
        }]
    }
};