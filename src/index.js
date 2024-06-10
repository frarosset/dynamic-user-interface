import DropDownMenu from './DropDownMenu.js';

let menuData = [
    {"label": "Anchor 1", "link":"#"},
    {"label": "Anchor 2", "link":"#"},
    {"label": "Simple Label", "link":null}
];

function init(){
    const showMenuOnHover = true;
    const body = document.querySelector('body');

    const header = document.createElement('header');
    body.appendChild(header);
    
    const dropDownMenu = new DropDownMenu(header,menuData,showMenuOnHover);
}

init();