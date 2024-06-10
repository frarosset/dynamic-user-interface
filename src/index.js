import DropDownMenu from './DropDownMenu.js';

let menuData = [
    {"label": "Anchor 1", "link":"#"},
    {"label": "Anchor 2", "link":"#"},
    {"label": null},
    {"label": "Simple Label", "link":null},
    {"label": "", "link":"#"},
];

function init(){
    const showMenuOnHover = true;
    const body = document.querySelector('body');

    const header = document.createElement('header');
    body.appendChild(header);
    
    const dropDownMenu = new DropDownMenu(header,menuData,showMenuOnHover);
}

init();