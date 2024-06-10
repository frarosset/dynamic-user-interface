import DropDownMenu from './DropDownMenu.js';

// menu options
const menuData = [
    {label: "Anchor 1", link:"#"},
    {label: "Anchor 2", link:"#"},
    {label: null},
    {label: "Simple Label"},
    {label: "Action 1", action: () => {alert('Action 1!');}},
    {label: "", link:"#"},
];
const showMenuOnHover = true;
const btnIcon = 'fa-solid fa-bars';
const btnLabel = 'MENU';

function init(){
    const body = document.querySelector('body');

    const header = document.createElement('header');
    body.appendChild(header);
    
    const dropDownMenu = new DropDownMenu(header,menuData,showMenuOnHover,btnIcon,btnLabel);
}

init();