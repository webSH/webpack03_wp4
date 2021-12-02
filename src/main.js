import '../assets/index.css'
import '../assets/index.less'
// import {funcHead} from "./head.js"
import { i, j } from './head'
console.log(i, j)
console.log('main.js: Hello World')
import wpLogo from "../assets/images/site-logo.svg";
document.getElementById("logo_wp").setAttribute('src', wpLogo);
// export function funcMain() {
// 	funcHead();
// 	console.log('在 main.js 中执行的 funcHead()');
// }
// funcMain();