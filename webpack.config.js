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
            test: /\.(sc|c|sa)ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'] //处理顺序从右向左进行
        }]
    }
};