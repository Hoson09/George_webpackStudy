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
- 注意：有根据终端的提醒来看 autoprefixer 插件的限定配置属性应该写在.browserslistrc or package.json文件中去。具体信息可以参考 https://github.com/browserslist/browserslist#readme 官网来进行配置。
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
7. css压缩
- webpack5 貌似会内置 css 的压缩，webpack4 可以自己设置一个插件即可。

- 压缩 css 插件：optimize-css-assets-webpack-plugin

```shell
npm i -D optimize-css-assets-webpack-plugin
```
- 安装完成后
```js
+ const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

optimization: {
     minimizer: [
    + new OptimizeCSSAssetsPlugin({})
     ]
  }

```
8. js压缩
- webpack 4以上才可以使用 这个js压缩的插件不能压缩es6语法，需要把es6的语法改为es5，否则报错。所以这步要完成的话必须先进行es6的babel转码才行。
```shell
  npm install uglifyjs-webpack-plugin --save-dev
```
- 安装完成后
```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
optimization: {
    minimizer: [
    + new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
    })
    ],
  },
```


## 合并两个webpack的js配置文件
- 开发环境(development)和生产环境(production)配置文件有很多不同点，但是也有一部分是相同的配置内容，如果在两个配置文件中都添加相同的配置节点， 就非常不爽。
- webpack-merge 的工具可以实现两个配置文件进合并，这样我们就可以把 开发环境和生产环境的公共配置抽取到一个公共的配置文件中。

```shell
npm install --save-dev webpack-merge
```
- 创建或者改造出三个文件夹 webpack.common.js webpack.dev.js webpack.prod.js

- 开始改造代码前先把现在写好的dev和prod各拷贝一份，虽然dev有些不全，但是我们可以对照了解哪些是需要的哪些是不需要的。

```js
//dev
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
```

```js
//prod
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
    ],
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({}) //压缩css插件
            , new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    }
};

```

- 现在开始改造...，改造完成后。
```js
const merge = require('webpack-merge');
const common = require('./webpack.common');

//把原来的模块输出属性 module.exports 改为 let devConfig 和 let prodConfig
//然后新的输出为:
//webpack.dev.js
module.exports = merge(common, devConfig); //如果前后有重复，后面会把前面的覆盖掉。
//webpack.prod.js
module.exports  = merge(common, prodConfig);//如果前后有重复，后面会把前面的覆盖掉

//这样写就可以避免书写重复的代码。
```
- 合并后的配置文件的内容是
- common
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js',
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
```
- dev
```js
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
let devConfig = {
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
    module: {
        rules: [{
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
module.exports = merge(common, devConfig); //后面会把前面的覆盖掉。

```

- prod

```js
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
```

## js 使用 source map
- 当 webpack 打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。例如，如果将三个源文件（a.js, b.js 和 c.js）打包到一个 bundle（bundle.js）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会简单地指向到 bundle.js。

- 因为webpack4内部集成这个属性，所以可以直接使用 inline-source-map 选项，这有助于解释说明 js 原始出错的位置。（不要用于生产环境）：

- 只能在dev下面添加：
```js
let devConfig = {
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
  + devtool: 'inline-source-map',//在开发阶段开启js的sourcemap记录
    module: {...}
};
```
- npm run build 即可查看效果了。

## 监控文件变化，自动编译。使用观察模式
- 每次修改完毕后，都手动编译异常痛苦。最简单解决的办法就是启动watch
```shell
npx webpack --watch
```
- 当然可以添加到 npm package.json 的 script 中
```json
{
"scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "npx webpack --config webpack.dev.js",
      + "watch": "npx webpack --watch --config webpack.dev.js",
        "dist": "npx webpack --config webpack.prod.js"
    },
}
```

- npm run watch 开启监听模式

## 使用 webpack-dev-server 和热更新 (开发阶段才使用，生产阶段不使用)

- webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。
```shell
npm install --save-dev webpack-dev-server
# 先安装包
```

- 安装完成后，在dev配置文件下进行配置修改：
```js
let devConfig = {
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
    devtool: 'inline-source-map', //在开发阶段开启js的sourcemap记录
 +  devServer: {
 +     contentBase: './dist'
 + },
    module: {
      ...
    }
};

```

- 修改完成，启动此 webserver： webpack-dev-server --open 

- 当然这只是最简洁的dev-server，还有更详尽的配置
```js
devServer{
  clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
  hot: true,  // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
  contentBase:  path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
  compress: true, // 一切服务都启用gzip 压缩
  host: '0.0.0.0', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
  port: 8080, // 端口
  open: true, // 是否打开浏览器
  overlay: {  // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
    warnings: true,
    errors: true
  },
  publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
  proxy: {  // 设置代理
    "/api": {  // 访问api开头的请求，会跳转到  下面的target配置
      target: "http://192.168.0.102:8080",
      pathRewrite: {"^/api" : "/mockjsdata/5/api"}
    }
  },
  quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
  watchOptions: { // 监视文件相关的控制选项
    poll: true,   // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
    ignored: /node_modules/, // 忽略监控的文件夹，正则
    aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟 防抖
  }
}
```

- 然后开始启动热更新
- 在dev中添加
```js
+ const webpack = require('webpack');

let devConfig ={
  ...,
  devServer: {
        clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
        hot: true, // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件(这个属性最关键)
        contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
        compress: true, // 一切服务都启用gzip 压缩
        host: '0.0.0.0', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
        port: 8080, // 端口
        open: true, // 是否打开浏览器
        overlay: { // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
            warnings: true,
            errors: true
        },
        publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
        proxy: { // 设置代理
            "/api": { // 访问api开头的请求，会跳转到  下面的target配置
                target: "http://192.168.0.102:8080",
                pathRewrite: { "^/api": "/mockjsdata/5/api" }
            }
        },
        quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
        watchOptions: { // 监视文件相关的控制选项
            poll: true, // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
            ignored: /node_modules/, // 忽略监控的文件夹，正则
            aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟
        }
  },
  plugins: [
  +   new webpack.NamedModulesPlugin(), // 更容易查看(patch)的依赖
  +   new webpack.HotModuleReplacementPlugin() // 替换插件
  ],
    ...
};

```
- 配置完文件后 npx webpack-dev-server --config webpack.dev.js 就开启了一个devserver服务器和热更新。
- 因为这个dev-server在内存里面生成的，所以编译速度非常快。
- npx webpack-dev-server --config webpack.dev.js 这个命令我们可以放在npm的配置文件里面。
```json
"scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "npx webpack --config webpack.dev.js",
        "watch": "npx webpack --watch --config webpack.dev.js",
        "dist": "npx webpack --config webpack.prod.js",
     +  "start": "npx webpack-dev-server --config webpack.dev.js"
    },
```
- npm run start 即可开启devserver和热更新

- 怎么模拟服务器代理？ 还有怎么非index.html的文件在服务器上指向index.html？？

- axios 是啥作用？干啥的？都不太懂。 npm i -P axios

## JS启用babel转码
- 虽然现代的浏览器已经兼容了96%以上的ES6的语法了，但是为了兼容老式的浏览器（IE8、9）我们需要把最新的ES6的语法转成ES5的。那么babel的loader就出场了。有babel更新了，对版本有要求，最好参考 https://www.npmjs.com/package/babel-loader 和 https://babeljs.io/docs/en/usage 来配置好版本。
```shell
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
npm i -D  babel-loader@8.0.6
```
- 因为这个js转码在dev和prod都需的，所以应该写在common里面

```js
//common文件
 
 module: {
        rules: [{
          +  test: /\.js$/,
          +  exclude: /(node_modules)/, // 加快编译速度，不包含node_modules文件夹内容
          +  use: {
          +     loader: 'babel-loader'
          + }
        }, ...
  }

```
 - 配置好babel-loader后，配置babel-loader的option属性，我们可以直接在loader: 'babel-loader' 后面添加option，也可以创建一个.babelrc文件来配置。'babel-loader' 后面添加option的情况可以参照 https://www.npmjs.com/package/babel-loader 。我们这里用的额是后一种方法,

 - 创建 .babelrc 文件，然后

 ```js
{
  "presets": ["@babel/env"]//在新版本babel文件中必须预设必须设置成这个样子。这个属性的设置可以把最新的语法都进行一个转码。
}

 ```

 - 然后可以 npm run build 和npm run dist 然后可以在dist目录下的main.js或者main[hash].js中查看es6转码为es5语法。

 ## babel的优化
 ### babel-loader可以配置如下几个options：
 - cacheDirectory：默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。如果设置了一个空值 (loader: 'babel-loader?cacheDirectory') 或者 true (loader: babel-loader?cacheDirectory=true)，loader 将使用默认的缓存目录 node_modules/.cache/babel-loader，如果在任何根目录下都没有找到 node_modules 目录，将会降级回退到操作系统默认的临时文件目录。 cacheDirectory：true 

```js
// 在common.js中进行配置。
use: {
                loader: 'babel-loader',
                options: {
            +       cacheDirectory: true //转码时先读取内存，然后在转码，提高效率
                }
            }

```


 > 注意：sourceMap 选项是被忽略的。当 webpack 配置了 sourceMap 时（通过 devtool 配置选项），将会自动生成 sourceMap。

 > 还有很多option属性的配置,可以参考官网。

 babel 在每个文件都插入了辅助代码，使代码体积过大.babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。 默认情况下会被添加到每一个需要它的文件中。你可以引入 babel runtime 作为一个独立模块，来避免重复引入。

安装 根据babel官方文档来看。

```shell
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

安装完成后，在.babelrc文件中添加

```json
{
  "presets": ["@babel/env"],
 + "plugins": [
    +  "@babel/plugin-transform-runtime",
    +  {
    +    "absoluteRuntime": false,
    +    "corejs": false,
    +    "helpers": true,
    +    "regenerator": true,
    +    "useESModules": false
      }
    ]
  
}

```
- 然后进行npm run build/dist 来启动。

## ESLint校验代码格式规范

- 安装

```shell
npm install eslint --save-dev
npm install eslint-loader --save-dev

# 以下是用到的额外的需要安装的eslint的解释器、校验规则等
npm i -D babel-eslint standard
```

- 使用 因为dev和prod都要使用eslint，所以我们要在common中进行配置。

```js
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
          +      loader: "eslint-loader",//一定要确保eslint在babel之后，因为要先执行eslint然后在js转码才行
          +      options: {
                    // eslint options (if necessary)
          +          fix: true
                }
            }]
        }, ...
}


```
- 配置eslint的属性。 eslint配置可以直接放到webpack的配置文件中，也可以直接放到项目根目录的 .eslintrc.js中 。创建.eslintrc.js文件，然后进行配置。配置好之后可能会不起作用，重启一下就好了。

```js
// .eslintrc.js
// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  globals: {
    NODE_ENV: false
  },
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 添加，分号必须
    semi: ['error', 'always'],
    'no-unexpected-multiline': 'off',
    'space-before-function-paren': ['error', 'never'],
    // 'quotes': ["error", "double", { "avoidEscape": true }]
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true
      }
    ]
  }
};

```

- eslint 对js 进行校验后，会出现很多错误，尤其会出现以下引入插件的错误，所以要创建一个.eslintignore 文件来忽略一些文件

```
# .eslintignore文件：
/dist/ 忽略dist文件夹
/node_modules/ 忽略node_modules文件夹
/*.js 忽略根目录下的所有的js文件。

```

## 解析(resolve) webpack自有属性，无需引入包和模块
- 配置模块如何解析。比如： import _ from 'lodash' ,其实是加载解析了lodash.js文件。此配置就是设置加载和解析的方式。

- resolve.alias 给模块设置别名

- 创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块。因为这个设置别名的在dev和dist都要使用，所以在common中设置。

- resolve.extensions的应用

```js 
{
   entry: './src/index.js',
+  resolve: {
+     extensions: ['.js', '.json', '.vue'],//模块化引入js，json，vue文件的时候可以不用添加后缀，直接引进文件名即可。extensions 是添加增加的意思
+     alias: {//配置别名.
+         '@': path.resolve(__dirname, 'src/')//@代表根目录下的src文件夹内部的地址。@ === /src/
+        }
   },...
}
```

## 外部扩展(externals) webpack自有属性，无需引入包和模块

- externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。 例如，从 CDN 引入 jQuery，而不是把它打包：

- 例如：main.html 引入了jQuery的cdn 但是我们并不想让他打包到我们的main.js中，我们就要在webpack中设置一个externals属性了，就可以避免被打包。
```html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```

- 因为dev和prod都需要所以，我们写在common配置文件中去 配置externals属性。
```js
module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.json', '.vue'], //模块化引入js，json，vue文件的时候可以不用添加后缀，直接引进文件名即可。extensions 是添加增加的意思
        alias: { //配置别名.
            '@': path.resolve(__dirname, 'src/') //@代表根目录下的src文件夹内部的地址。@ === /src/
        }
    },
   + externals: {//外部的意思,这个属性可以把一个模块做成外部依赖，不会打包到你的output指定的js文件中去。
   +     jquery: 'jQuery'
   + },
    ...
}

```

- 设置好后。webpack默认不会打包，并且因为他写在main.html文件的head标签中，所以他是作为全局的插件，任何地方都可以使用。

## 打包分析报表插件与优化总结
- webpack-bundle-analyzer https://www.npmjs.com/package/webpack-bundle-analyzer
- 安装：
```shell
# NPM 
npm install --save-dev webpack-bundle-analyzer
# Yarn 
yarn add -D webpack-bundle-analyzer

```
- 使用： 因为我们只能在dev环境下用，所以要把配置内容写在dev的配置文件中
- 在dev中添加的内容：
```js
+ const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    ...,
  plugins: [
        new webpack.NamedModulesPlugin(), // 更容易查看(patch)的依赖
        new webpack.HotModuleReplacementPlugin(), // 替换插件
    +   new BundleAnalyzerPlugin() //打包模块报表。
  ],
  ...
}

```
- 配置信息完成后 npm run build 就可以直接跳出一个本地网页 http://127.0.0.1:8888/ 来直接显示你的打包分析报表。显示报表发现，lodash插件压缩后太大了占据了主函数大部分的内存，所以应该使用 外部扩展(externals) 把lodash插件做成外部依赖。

- 先进入 common的配置文件中 设置externals属性

```js
module.exports = {
    ...,
externals: { //外部的意思,这个属性可以把一个模块做成外部依赖，不会打包到你的output指定的js文件中去。
        jquery: 'jQuery',
   +    lodash: '_'
    },
    ...
};

```
- 然后在模板html页面(main.html)的head标签中添加 lodash 的cdn标签，就可以把lodash做成一个外部依赖的插件，webpeak在打包js的时候就不会把lodash 打包到指定的js文件中去了。(这个文件中的lodash的cdn写的不完整，所以建议暂时不要进行测试，还是使用)

## 总结：common.js dev.js prod.js分别为：

- common.js
```js
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

```

- dev.js

```js
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let devConfig = {
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist') //相对路径转换为绝对路径。
    },
    devtool: 'inline-source-map', //在开发阶段开启js的sourcemap记录
    devServer: {
        clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
        hot: true, // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
        contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
        compress: true, // 一切服务都启用gzip 压缩
        host: '0.0.0.0', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
        port: 8080, // 端口
        open: true, // 是否打开浏览器
        overlay: { // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
            warnings: true,
            errors: true
        },
        publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
        proxy: { // 设置代理
            "/api": { // 访问api开头的请求，会跳转到  下面的target配置
                target: "http://192.168.0.102:8080",
                pathRewrite: { "^/api": "/mockjsdata/5/api" }
            }
        },
        quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
        watchOptions: { // 监视文件相关的控制选项
            poll: true, // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
            ignored: /node_modules/, // 忽略监控的文件夹，正则
            aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟
        }
    },
    plugins: [
        new webpack.NamedModulesPlugin(), // 更容易查看(patch)的依赖
        new webpack.HotModuleReplacementPlugin(), // 替换插件
        new BundleAnalyzerPlugin() //打包模块报表。
    ],
    module: {
        rules: [{
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
                            require('autoprefixer')() // 添加前缀
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
module.exports = merge(common, devConfig); //后面会把前面的覆盖掉。

```

- prod.js

```js
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

```
















