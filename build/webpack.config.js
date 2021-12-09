const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");

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
			// {
			// 	test: /\.css$/, //正则匹配文件名称（类型）
			// 	use: [MiniCssExtractPlugin.loader, 'css-loader'] // 从右向左 ← 解析原则
			// },
			{
				test: /\.css$|\.less$/,
				use: [MiniCssExtractPlugin.loader, /*'style-loader',*/ 'css-loader', 
				{	//加入此对象来引入 postcss-loader 和 autoprefixer 插件(使用了 MiniCssExtractPlugin，需要去掉 style-loader)
					loader: 'postcss-loader',
					options:{
						postcssOptions: { // 注意 plugins 外面要套一个对象 postcssOptions
							plugins:[require('autoprefixer')]
						}
					}
				},
				'less-loader']
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i, // 图片文件
				use: [
					{
						loader: 'url-loader', //使用 url-loader 的条件在下面
						options: {
							limit: 2259, // byte 字节 10240 byte = 10 kB
							fallback: { //2259 byte 使用 file-loader
								loader: 'file-loader',
								options: {
									name: 'img/[name].[hash:8].[ext]'
								}
							}
						}
					}
				]
			},
			{
				test: /\.js$/,
				use:{
					loader:'babel-loader',
					options:{
						presets:['@babel/preset-env']
					}
				},
				exclude: /node_mudules/
			}
		],
	},
	devServer: {
		port: 3000,
		hot: true,
		open: true,
		static: path.join(__dirname, "../dist"),
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
		new MiniCssExtractPlugin({
			filename: "[name].[hash].css",
			chunkFilename: "[id].css"
		}),
		new CleanWebpackPlugin(),
		new Webpack.HotModuleReplacementPlugin()
	]
}