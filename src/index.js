import DropDownMenu from './DropDownMenu.js';

let menuData = [
    {"label": "Anchor 1", "link":"#"},
    {"label": "Anchor 2", "link":"#"},
    {"label": "Simple Label", "link":null}
];

function init(){
    let body = document.querySelector('body');

    let header = document.createElement('header');
    body.appendChild(header);
    
    let dropDownMenu = new DropDownMenu(header,menuData);

}

init();