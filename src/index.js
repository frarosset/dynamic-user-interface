import './index.css';
import DropDownMenu from './DropDownMenu.js';
import ImageCarousel from './ImageCarousel.js';

// menu options
const menuData = [
    {label: "Anchor 1", link:"#"},
    {label: "Anchor 2", link:"#", faIcon: {prefix: "regular", icon: "star"}},
    {label: "", link:"#", faIcon: {prefix: "regular", icon: "heart"}},
    {label: null},
    {label: "Simple Label 1"},
    {label: "Simple Label 2", faIcon: {prefix: "regular", icon: "moon"}},
    {label: "", faIcon: {prefix: "regular", icon: "sun"}},
    {label: null},
    {label: "Action 1", action: () => {alert('Action 1!');}},
    {label: "Action 2", action: () => {alert('Action 2!');}, faIcon: {prefix: "regular", icon: "user"}},
    {label: "", action: () => {alert('Action 3!');}, faIcon: {prefix: "regular", icon: "face-smile"}}
];
const showMenuOnHover = true;
const btnFaIcon = {prefix: 'solid', icon: 'bars'};

// image carousel
const imageWidth = 1600;
const imageHeight = 900;
const imageNum = 5; //[1,99]
const imagesPaths = Array(imageNum).fill().map((_,idx) => `https://lipsum.app/id/${idx}/${imageWidth}x${imageHeight}`);
const imageCarouselOptions = {
    imgWidthPercentage: 50,
    autoCycling: true,
}


function init(){
    const body = document.querySelector('body');

    const header = document.createElement('header');
    body.appendChild(header);
    
    const dropDownMenuL = new DropDownMenu(header,menuData,showMenuOnHover,btnFaIcon,'LEFT','left');
    dropDownMenuL.getElement().classList.add('ddm-left');
    const dropDownMenuC = new DropDownMenu(header,menuData,showMenuOnHover,btnFaIcon,'CENTER','center');
    dropDownMenuC.getElement().classList.add('ddm-center');
    const dropDownMenuR = new DropDownMenu(header,menuData,showMenuOnHover,btnFaIcon,'RIGHT','right');
    dropDownMenuR.getElement().classList.add('ddm-right');

    const main = document.createElement('main');
    body.appendChild(main);

    const imageCarousel = new ImageCarousel(main,imagesPaths,imageCarouselOptions);
    imageCarousel.getElement().classList.add('my-image-carousel');
}

init();