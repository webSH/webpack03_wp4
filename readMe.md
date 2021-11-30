# webpack 入门 (webpack 4)
>- 相关环境、依赖版本  
> 	- node.js：v14.16.0
> 	- webpack: "4.46.0"
> 	- webpack-cli: "4.9.1"
## 1.建立项目
- 新建文件夹：webpack03_wp4
- 初始化 npm：在此目录命令行执行 `npm init`，一路回车。根目录生成 package.json 文件
## 2.安装 webpack（以及 webpack-cli）
`npm i -D webpack@4 webpack-cli`
- npm i -D 为 npm install --save-dev 的缩写
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
