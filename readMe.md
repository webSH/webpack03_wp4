# webpack 入门 (webpack 4)
>- 相关环境、依赖版本  
> 	- node.js：v14.16.0
> 	- webpack: "4.46.0"
> 	- webpack-cli: "4.9.1"
> 	- html-webpack-plugin: "4.5.2" //版本 ^5 需要 webpack5 支持
> 	- css-loader: ^5.0.2
> 	- less: ^4.1.2"
> 	- less-loader: ^7.3.0"
> 	- style-loader: ^2.0.0"
> 	- postcss-loader: 4.3.0
> 	- mini-css-extract-plugin: ^1.6.2
## 1.建立项目
- 新建文件夹：webpack03_wp4
- 初始化 npm：在此目录命令行执行 `npm init`，一路回车。根目录生成 package.json 文件
## 2.安装 webpack（以及 webpack-cli）
`npm i -D webpack@4 webpack-cli`
- <span class="red">npm i -D</span> 为 npm install --save-dev 的缩写
- npm i -S 为 npm install --save 的缩写
### 测试一下
- 新建文件夹 src，新建一个文件 main.js，写点代码
>- src
>   - main.js

main.js
```js
 console.log('Hello World')
```
配置 package.json 命令
```js
"scripts": {
	"build": "webpack ./src/main.js" //webpack4 以上，可以不需要配置文件，并推荐入口文件 src/index.js。（注意：webpack-cli3.x —— src | /src | ./src 三种路径写法都可以，但 ../src 这种写法表示上一级目录的 src ，不可以，webpack-cli4.x 仅支持 ./src 写法）。注意低级错误：mian.js
}
```
ok，命令行： `npm run build`，此时如果生成了一个 dist 文件夹，并且内部含有 main.js 说明打包成功！
>- dist
>   - main.js
## 3.搞一个配置文件 **webpack.config.js**
上面只是对简单的一个 webpack 默认配置的打包命令。下面我们要实现更加丰富的自定义配置  
### 3.1 新建一个 build 文件夹，里面新建一个 **webpack.config.js**
>- build
> 	- webpack.config.js
### webpack.config.js
```js
const path = require('path');
module.exports = {
	mode: 'development', // 开发模式
	entry: path.resolve(__dirname, '../src/main.js'), // 入口文件
	output: {
		filename: 'output.js', // 打包后的文件名
		path: path.resolve(__dirname, '../dist') // 打包后的目录
	}
}
```
### 3.2 更改我们的打包命令
```js
"scripts": {
	"build": "webpack --config build/webpack.config.js"
}
```
执行 `npm run build` 生成以下目录文件
>- dist
>   - output.js
### 3.3 弄一个 html 模板，插入打包的 js 文件
js 文件打包好，需要引入到 html 文件中使用，且实际工程中，为了防止 js 文件缓存，打包后的 js 文件命名中会加入 hash 值 
> webpack.config.js 片段
```js
 module.exports = {
	 //省略...
	 output: {
		 filename: '[name].[hash:8].js', // 打包后的文件名(包含8位hash值) 
		 path: path.resolve(__dirname, '../dist') // 打包后的路径
	 }
 }
```
这时候打包生成的 dist 目录文件如下：
>- dist
>	- main.d3089280.js

每当修改了文件，打包 js 名称就会变更，我们想要一个自动更新引入 html 的 js 文件名，现在需要插件 **html-webpack-plugin** 来实现  
安装：`npm i -D html-webpack-plugin@4`   //版本 ^5 需要 webpack5 支持
新建一个文件夹 public，里面新建一个 index.html
配置文件 webpack.config.js 代码如下（片段）：
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	mode: 'development', // 开发模式
	entry: path.resolve(__dirname, '../src/main.js'), // 入口文件
	output: {
		filename: '[name].[hash:8].js', // 打包后的文件名(hash 的取值？html和js修改都会改变)
		path: path.resolve(__dirname, '../dist') // 打包后的目录
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html') //指定插件处理的文件路径
		})
	]
}
```
`npm run build` 生成如下目录：
>- dist
>	- main.95bf8b8f.js
>	- index.html  (main.95bf8b8f.js 会自动插入到 <body>标签最后)

### 3.5 残留文件清理
>每次执行 npm run build 会发现 dist 文件夹里会残留上次打包的文件，这里可以用一个 plugin 来帮我们清除之前打包的残留文件 —— <font color="red">clean-webpack-plugin</font>

<font color="red">要安装一下啊 `npm i -D clean-webpack-plugin`</font>  
webpack.config.js 片段：
```js
const {CleanWebpackPlugin} = require('clean-webpack-plugin)
mudule.exports = {
	// 。。。省略其他配置
	plugins: [
		new CleanWebpackPlugin()
	]
}
```

## 4. 插入 css、less、sass 文件
我们的入口文件是 js，所以我们在入口 js 文件中引入我们的 css 文件  
main.js 头部使用 import 引入
```js
import '../assets/index.css' // 正确路径 ../； ./ 是在 main.js 的 src/ 本目录来寻找文件
import '../assets/index.less'
```
同时，我们也需要一些 loader 来解析我们的 css 文件
`npm i -D style-loader@2 css-loader@5`
如果 less 文件的话，需要多安装两个：
`npm i -D less@4 less-loader@7`
配置文件 webpack.config.js 片段如下：
```js
mudule.exports = {
	//...省略其他配置
	module: {
		rules:[
			{
				test: /\.css$/, //正则匹配文件名称（类型）
				use: ['style-loader', 'css-loader'] // 从右向左解析原则
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader']
			}
		]
	}
}
```
`npm run build` 注意，生成的css是以 \<style\> 标签的方式插入到 \<script\> 标签之后，每个 css 文件一个 \<style\> 标签。而且是通过 js 插入到，并不是直接打包到 html 文件中的。（如果不引入 loader，打包将不会成功）

### 4.1 为 css 添加浏览器前缀
我们将用到 postcss-loader 和 autoprefixer。 `npm i -D postcss-loader@4 autoprefixer`  
webpack.config.js 片段：
```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ['style-loader','css-loader','postcss-loader','less-loader'] //从右向左解析
			}
		]
	}
}
```
接下来，我们还需要引入插件 autoprefixer 使其生效，这里有两种方式  
1. 在项目根目录下创建一个 postcss.config.js 文件，配置如下：
```js
module.exports = {
	plugins: [require('autoprefixer')] //引用该插件即可了
}
```
2. 直接在 webpack.config.js 里配置：  // (未成功，报错，plugins 外面要套一个对象 postcssOptions)
   webpack.config.js 片段：
```js
module.exports = {
	//...省略一些配置
	module:{
		rules: [{
			test:/\.less$/,
			use:['style-loader', 'css-loader', 
			{	//加入此对象来引入 postcss-loader 和 autoprefixer 插件
				loader: 'postcss-loader',
				options:{
					postcssOptions: { // 注意★★★ plugins 外面要套一个对象 postcssOptions
						plugins:[require('autoprefixer')]
					}
				}
			},
			'less-loader']
		}]
	}
}
```

### 4.2 拆分 css
>以上方式 css 代码是以 \<style\> 标签的方式插入到 html 文件当中，如果样式文件很多，全部添加到 html 中，难免显得混乱。这时候我们想用外链形式引入 css 文件怎么做呢？就用到一个插件：

`npm i -D mini-css-extract-plugin@1`
> webpack 4.0 以前，我们通过 extract-text-webpack-plugin 插件，把 css 样式从 js 文件中提取到单独的 css 文件中。webpack 4.0 以后，官方推荐使用 mini-css-extract-plugin 插件来打包 css 文件

webpack.config.js片段：
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
	// ...省略一些配置
	module: {
		rules: [
			{
				test: /\.css$|\.less$/,
				use: [ //不需要 style-loader 了
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
			}
		]
	}
},
plugins: [
	new MiniCssExtractPlugin({
		filename: "[name].[hash].css",
		chunkFilename: "[id].css"
	})
]
```
> `npm run build` 打包完成，多个 css 文件会合并成一个 css 文件，使用 &lt;style&gt; 标签插入到 html 文件中
### 4.3 拆分多个 css (未成功 ，extract-text-webpack-plugin 已不支持 webpack4？)
> 以上方式使用 mini-css-extract-plugin 将几个css 文件打包在一个 css 文件中，如果想分开对应多个 css 文件，我们需要使用 `npm i -D extract-text-webpack-plugin`  
webpack.config.js 片段：
```js
 const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
 let indexLess = new ExtractTextWebpackPlugin('index.less');
 let indexCss = new ExtractTextWebpackPlugin('index.css');
 module.exports = {
	 // 。。。省略一些代码
	 module:{
		 rules:[
			 {
				 test:/\.css$/,
				 use: indexCss.extract({
					 use: ['css-loader']
				 })
			 },
			 {
				 test:/\.less$/,
				 use: indexLess.extract({
					 use:['css-loader', 'less-loader']
				 })
			 }
		 ]
	 },
	 plulgins: [
		 indexLess,
		 indexCss
	 ]
 }
```
## 5. 插入 图片、媒体 等文件 **file-loader、 url-loader**
`npm i -D file-loader url-loader`
**file-loader** 就是将文件在进行一些处理后（主要是处理文件名和路径、解析文件 url），并将文件移动到输出的目录中；**url-loader** 与 file-loader 搭配使用，功能与 file-loader 类似，如果文件 <span style="color:red"><= limit</span> 大小，则返回 base64 编码，否则使用 **file-loader** 将文件输出到配置目录。
> webpack.config.js 片段
```js
module.exports = {
	// ...省略一些配置
	module: {
		rules: [
			// ...
			{
				test: /\.(jpe?g|png|gif|svg)$/i, // 图片文件
				use: [
					{
						loader: 'url-loader', //使用 url-loader 的条件在下面
						options: {
							limit: 10240, // byte 字节 10240 byte = 10 kB
							fallback: { //大于10240 byte(10kB)使用 file-loader
								loader: 'file-loader',
								options: {
									name: 'img/[name].[hash:8].[ext]'
								}
							}
						}
					}
				]
			}
		]
	}
}
```
> **图片文件需要通过 js import 进来才可以使用以上 loader 来处理，直接插入到 html 的文件不会被 loader 处理**
