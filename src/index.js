import _ from 'lodash';
import './style/index.css'; // webpack是从入口文件开始执行引入的文件 引入css文件，但是webpack自身处理不了css文件，所以要加入loader来协助处理。 loader ==> css-loader style-loader
import './style/a.scss';
import { d, e, f } from '@/b'; // => /src/b.js
// import axios from 'axios';
// 引入jQuery,因为jquery在webpack中已经设置了externals属性，所以就算这里引入jquery，webpack也不会对他进行打包，默认他是一个外部引入的插件。
import $ from 'jquery';

function createDomElement() {
  const dom = document.createElement('div'); // webpack的UglifyJsPlugin对js进行压缩的时候不能压缩es6语法，压缩了会报错的。需要把原来的let改为var才行。
  dom.innerHTML = _.join(['huyi', 'is', 'the', 'Best'], '');
  // dom.className = 'box';
  dom.classList.add('box');
  return dom;
}
const divDom = createDomElement();
document.body.appendChild(divDom);

console.log('12222333');
// 发送ajax请求？？？
// axios.get('/api/compmsglist').then(res => console.log('res:', res));

class Demo {
  show() {
    console.log('this.age:', this.Age);
  }

  get Age() {
    return this._age;
  }

  set Age(val) {
    this._age = val + 1;
  }
}
const d1 = new Demo();
d1.Age = 19;
d1.show();
const [a, b, c] = [1, 2, 3];
console.log('a:', a);
console.log('b:', b);
console.log('c:', c);
console.log('d:', d);
console.log('e:', e);
console.log('f:', f);
$(function() {
  console.log('jquery:');
  $('.box').on('click', function(e) {
    alert('222');
  });
});
