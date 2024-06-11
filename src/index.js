import DropDownMenu from './DropDownMenu.js';
import ImageCarousel from './ImageCarousel.js';

// menu options
const menuData = [
    {label: "Anchor 1", link:"#"},
    {label: "Anchor 2", link:"#", icon: "fa-regular fa-star"},
    {label: "", link:"#", icon: "fa-regular fa-heart"},
    {label: null},
    {label: "Simple Label 1"},
    {label: "Simple Label 2", icon: "fa-regular fa-moon"},
    {label: "", icon: "fa-regular fa-sun"},
    {label: null},
    {label: "Action 1", action: () => {alert('Action 1!');}},
    {label: "Action 2", action: () => {alert('Action 2!');}, icon: "fa-regular fa-user"},
    {label: "", action: () => {alert('Action 3!');}, icon: "fa-regular fa-face-smile"},
];
const showMenuOnHover = true;
const btnIcon = 'fa-solid fa-bars';
const btnLabel = 'MENU';

// image carousel
const imageWidth = 1600;
const imageHeight = 900;
const imageNum = 5; //[1,99]
const imagesPaths = Array(imageNum).fill().map((_,idx) => `https://lipsum.app/id/${idx}/${imageWidth}x${imageHeight}`);

function init(){
    const body = document.querySelector('body');

    const header = document.createElement('header');
    body.appendChild(header);
    
    const dropDownMenu = new DropDownMenu(header,menuData,showMenuOnHover,btnIcon,btnLabel,'left');
    const dropDownMenu2 = new DropDownMenu(header,menuData,showMenuOnHover,btnIcon,btnLabel,'center');
    const dropDownMenu3 = new DropDownMenu(header,menuData,showMenuOnHover,btnIcon,btnLabel,'right');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';

    // add an horizonatal line, just for testing purposes
    const separator = document.createElement('hr');
    body.appendChild(separator);

    const main = document.createElement('main');
    body.appendChild(main);

    const imageCarousel = new ImageCarousel(main,imagesPaths);
}

init();