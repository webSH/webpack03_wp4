const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	mode: 'development', // 开发模式
	// entry: path.resolve(__dirname, '../src/main.js'), // 单入口文件
	entry: {
		main: path.resolve(__dirname, '../src/main.js'), // 入口命名，供 plugins 中使用
		head: path.resolve(__dirname, '../src/head.js') // 入口命名，供 plugins 中使用
	},
	output: {
		filename: '[name].[hash:8].js', // 打包后文件名称
		path: path.resolve(__dirname, '../dist') // 打包后的目录
	},
	module:{
		rules:[
			{
				test: /\.css$/, //正则匹配文件名称（类型）
				use: ['style-loader', 'css-loader'] // 从右向左 ← 解析原则
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader']
			}
		],
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	template: path.resolve(__dirname, '../public/index.html')
		// })  //指定插件处理文件的路径(针对单入口文件)
		new HtmlWebpackPlugin({ //(多入口文件，每个文件一个实例)
			template: path.resolve(__dirname, '../public/index.html'), //指定插件处理文件的路径
			filename: 'index.html', // 命名
			chunks: ['main'] // 与入口文件对应的模块名
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/head.html'),
			filename: 'head.html',
			chunks: ['head'] // 可引入多个 chunks（['head','main']），但顺序不一定和数组一致
		}),
		new CleanWebpackPlugin()
	]
}