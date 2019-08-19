import _ from 'lodash';
import './style/index.css'; //引入css文件，但是webpack自身处理不了css文件，所以要加入loader来协助处理。 loader ==> css-loader style-loader
import './style/a.scss';

function createDomElement() {
    let dom = document.createElement('div');
    dom.innerHTML = _.join(['huyi', 'is', 'the', 'Best'], '');
    // dom.className = 'box';
    dom.classList.add('box');
    return dom;
}
let divDom = createDomElement();
document.body.appendChild(divDom);