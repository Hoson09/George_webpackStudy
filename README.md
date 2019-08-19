# webpack的学习笔记
> 这是我自己的学习笔记，可能不是非常正确。如果对您造成困扰,我很抱歉。
## 第一步 配置初始开发环境
1. 首先先npm生成配置文件
```shell
npm init -y
```
2. 本地安装webpack 如果是webpack 4以上的版本还要安装本地安装webpack-cli
```shell
npm i -D webpack
npm i -D webpack-cli
```
3. 然后设定两个文件夹dist和src文件夹（其中dist文件夹可以动态生成的，所以设置到.gitignore文件中去了）在src文件中生成一个入口文件index.js和存放样式的style文件夹。然后在入口文件index.js中引入相关的插件和样式类型，在style文件夹中书写scss文件和css文件。

## 第二步 初步编写webpack的配置文件
1. 在根目录上编写webpack初始配置文件，webpack.config.js

2. 在webpack.config.js引入const path = require('path');

3. 因为webpack也是在node.js环境下运行，所以可以直接使用node环境下的module.exports方法来输出模块的对象。

4. 输出的对象中要设定 入口文件entry  开发环境mode 输出文件output 使用的模块module 等属性

5. 因为webpack可以处理js文件，但是除了js之外的文件就要使用想应的loader来解决问题了。在使用的模块module中就可以添加这些loader文件。

6. 引入需要引进的loader

```shell
npm i -D style-loader css-loader
npm i -D sass-loader node-sass
```
- css-loader： 辅助解析 js 中的 import './main.css'
- style-loader: 把 js 中引入的 css 内容 注入到 html 标签中，并添加 style 标签.依赖 css-loader

7. 初步书写webpack配置文件
```js
const path = require('path');//引入path模块
module.exports = {
    entry: './src/index.js',//入口脚本是同目录下的src文件下的index.js文件
    mode: 'development',//处于开发环境
    output: {
        filename: 'main.js',//输出文件名为main.js
        path: path.resolve(__dirname, 'dist') //这个输出文件的地址为'/dist',（path.resolve()方法可以把相对路径转换为绝对路径。）
    },
    module: {//使用的模块
        rules: [{
            test: /\.(sc|c|sa)ss$/,//在入口文件中处理scss,css,sass等文件
            use: ['style-loader', 'css-loader', 'sass-loader'] //使用这三个loader来协助处理以上的三种文件，而且这三个loader的处理顺序从右向左进行的。
        }]
    }
};
```

8. 初步写完之后，运行webpack的配置文件
```shell
 npx webpack
```
- npx webpack ：可以直接在node文件夹内执行webpack包的二进制文件,然后会直接寻找命名为webpack.config.js文件运行。因为npx webpack 一直要使用，所以我们可以把这个命令写在npm的配置文件里，即"scripts":{"build":"npx webpack"}。
- 运行配置文件后会在dist文件夹内生成main.js文件，然后把这个文件引入到dist的html文件下方当做入口文件，就可以初步看到效果。






