import DropDownMenu from './DropDownMenu.js';

function init(){
    let body = document.querySelector('body');

    let header = document.createElement('header');
    body.appendChild(header);
    
    let dropDownMenu = new DropDownMenu(header);

}

init();