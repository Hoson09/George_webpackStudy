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

## 第二步 初步编写webpack开发阶段的配置文件 dev
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

9. 创建启用sourceMap

- css-loader和sass-loader都可以通过该 options 设置启用 sourcemap。因为之前只是使用了这些loader的简写，所以要是使用这些loader的sourceMap方法，就要把在这些loader里面添加sourcemap的options属性。改写如下：
```js
  use: [{
          loader: "style-loader" //loader 的另一种书写方式
        }, {
          loader: "css-loader",
          options: {//options属性
            sourceMap: true//启用sourcemap属性
          }
        }, {
          loader: "sass-loader",
          options: {
            sourceMap: true
          }
  }]
```
- npm run build 运行webpack，就可以查看每个dom标签对象css样式的sourcemap了。

10. PostCSS处理loader 帮助给css3添加前缀。
- PostCSS是一个 CSS 的预处理工具，可以帮助我们：给 CSS3 的属性添加前缀，样式格式校验（stylelint），提前使用 css 的新特性比如：表格布局，更重要的是可以实现 CSS 的模块化，防止 CSS 样式冲突。
- 先本地安装postcss-loader,以及你要使用的autoprefixer插件。
```shell
npm i -D postcss-loader
npm install autoprefixer --save-dev
```
- 一般在sass处理完成后进行添加前缀，所以要在数组的sass-loader和css-loader之间添加postcss-loader
```js
   {
      loader: 'postcss-loader',//使用postcss-loader插件
      options: {
      ident: 'postcss',//这个没听懂是什么意思。
      sourceMap: true,//启用sourcemap
      plugins: loader => [//plugins是用来给loader添加相应的插件的。
          require('autoprefixer')({ browsers: ['> 0.15% in CN'] }) // 添加前缀
                ]
      }
    }
```
11. 加载图片和图片优化
- 先在src文件夹下创建一个asset/img 文件夹，下载几张图片，然后在style/a.scss文件中的background：url('...最好使用相对路径')引入图片。

- webpack不能处理img文件，会报错
```shell
ERROR in ./src/static/1.jpeg 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
```
- 此时我们就需要一些loader来帮忙处理了，file-loader
```shell
npm install --save-dev file-loader
# 安装file-loader包。
```
- 在配置文件中添加的内容 安装好包后只用添加一个模块即可，然后引入file-loader即可。
```js

module: {
        rules: [{
            + test: /\.(png|svg|jpg|gif|jpeg)$/,
            + use: [
            +    'file-loader'
            ]
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

```
- file-loader 只能处理和添加图片等内容，想要压缩优化图片的话，就要使用image-webpack-loader了

```shell
npm install image-webpack-loader --save-dev
```
- 安装好后，需要在file-loader使用之前，使用image-webpack-loader即可。

```js
{
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'file-loader',//然后将图片复制到dist目录中
+           {
+             loader: 'image-webpack-loader',//先将图片压缩优化，
+             options: {
+               mozjpeg: {
+                 progressive: true,
+                 quality: 65
+               },
+               optipng: {
+                 enabled: false,
+               },
+               pngquant: {
+                 quality: '65-90',
+                 speed: 4
+               },
+               gifsicle: {
+                 interlaced: false,
+               },
+               webp: {
+                 quality: 75
+               }
+             }
+           },
          ]
        }

```

12. 更进一步处理图片成 base64
- url-loader功能类似于 file-loader，可以把 url 地址对应的图片文件，打包成 base64 的 DataURL，提高访问的效率（小图片可以，但是大图还是使用file-loader）,可以减少一次网络请求
```shell
npm install --save-dev url-loader
```
- 安装完成后，url-loader 替换 file-loader 

```js
{
    loader: 'url-loader', // 根据图片大小，把图片优化成base64，减少请求一次图片的请求
    options: {
      limit: 10000//小于10000字节的图片使用url-loader，大于的继续使用file-loader。
    }
},

```


## 第三步 编写webpack生产阶段的配置文件 product
1. 创建webpack.product.config生产阶段配置文件

2. 样式表抽离成专门的单独文件并且设置版本号

- 首先以下的 css 的处理我们都把 mode 设置为 production。
- webpack4 开始使用： mini-css-extract-plugin插件, 1-3 的版本可以用： extract-text-webpack-plugin

> 抽取了样式，就不能再用 style-loader注入到 html 中了。

- 先本地安装 mini-css-extract-plugin 插件 并引入 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
```shell
npm install --save-dev mini-css-extract-plugin
```
- 暂时书写的product配置文件如下：

```js
const path = require('path');
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');//引入包
module.exports = {
    entry: './src/index.js',
    mode: 'production',//改成production环境
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
    module: {
        rules: [{
            test: /\.(sc|c|sa)ss$/,
            use: [
                    + MiniCssExtractPlugin.loader,//把style-loader换成MiniCssExtractPlugin.loader。
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
        + new MiniCssExtractPlugin({ //抽取css文件
            filename: '[name].[hash].css', // 设置最终输出的文件名 [name]与output的文件名是相同的。
            chunkFilename: '[id].css'
        })
    ]
};

```
> 这样虽然把css文件从main.js文件中给抽离了出来，但是这样就需要我们自己手动去引入才行，并且每次生成都会重新生成一个哈希值，所以非常麻烦。并且我们应用的js文件如果也打上哈希值的话，那么也需要我们每次都去添加，所以我们需要一个HtmlWebpackPlugin插件来解决问题。

3. 解决 CSS 文件或者 JS 文件名字哈希变化的问题

- HtmlWebpackPlugin插件，可以生成一个模板，然后把打包后的 CSS 或者 JS 文件引用直接注入到 HTML 模板中，这样就不用每次手动修改文件引用了。

```shell
npm install --save-dev html-webpack-plugin
# 安装html-webpack-plugin包
```
- 在配置文件中添加的内容为：

```js
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
        new MiniCssExtractPlugin({ //提取css文件的
            filename: '[name][hash].css', // 设置最终输出的文件名
            chunkFilename: '[id][hash].css'
        }), 
        + new HtmlWebpackPlugin({//生成一个模板，然后把打包后的 CSS 或者 JS 文件引用直接注入到 HTML 模板中
            title: 'George', // 默认值：Webpack App
            filename: 'main.html', // 输出到dist的html文件名  默认值：'index.html'
            template: path.resolve(__dirname, 'src/main.html'), //指定的模板
            minify: {
                collapseWhitespace: true, //折叠空白
                removeComments: true, //移除注释
                removeAttributeQuotes: true // 移除属性的引号
            }
        })
    ]

```
> 每次运行配置文件都会新生成文件，所以我们需要清理文件

4. 清理目录插件 clean-webpack-plugin
```shell
npm install clean-webpack-plugin --save-dev
# 安装 clean-webpack-plugin 包
```
- 在配置文件中添加的内容为：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
        }), 
        + new CleanWebpackPlugin()//CleanWebpackPlugin找到output 中的path路径然后进行删除。
    ]

```

5. 加载图片和图片优化
- 先在src文件夹下创建一个asset/img 文件夹，下载几张图片，然后在style/a.scss文件中的background：url('...最好用相对路径')引入图片。

- webpack不能处理img文件，会报错
```shell
ERROR in ./src/static/1.jpeg 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
```
- 此时我们就需要一些loader来帮忙处理了，file-loader 可以引入添加一些文件。
```shell
npm install --save-dev file-loader
# 安装file-loader包。
```
- 在配置文件中添加的内容 安装好包后只用添加一个模块即可，然后引入file-loader即可。
```js

module: {
        rules: [{
            + test: /\.(png|svg|jpg|gif|jpeg)$/,
            + use: [
            +    'file-loader'
            ]
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

```
- file-loader 只能处理和添加图片等内容，想要压缩优化图片的话，就要使用image-webpack-loader了

```shell
npm install image-webpack-loader --save-dev
```
- 安装好后，需要在file-loader使用之前，使用image-webpack-loader即可。

```js
{
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'file-loader',//然后将图片赋值拷贝到dist目录中
+           {
+             loader: 'image-webpack-loader',//先对图片进行压缩优化
+             options: {
+               mozjpeg: {
+                 progressive: true,
+                 quality: 65
+               },
+               optipng: {
+                 enabled: false,
+               },
+               pngquant: {
+                 quality: '65-90',
+                 speed: 4
+               },
+               gifsicle: {
+                 interlaced: false,
+               },
+               webp: {
+                 quality: 75
+               }
+             }
+           },
          ]
        }

```

6. 更进一步处理图片成 base64
- url-loader功能类似于 file-loader，可以把 url 地址对应的图片文件，打包成 base64 的 DataURL，提高访问的效率（小图片可以，但是大图还是使用file-loader）,可以减少一次网络请求
```shell
npm install --save-dev url-loader
```
- 安装完成后，url-loader 替换 file-loader 

```js
{
    loader: 'url-loader', // 根据图片大小，把图片优化成base64，减少请求一次图片的请求
    options: {
      limit: 10000//小于10000字节的图片使用url-loader，大于的继续使用file-loader。
    }
},

```










