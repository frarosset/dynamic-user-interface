import './DropDownMenu.css';
import {initDiv, initP, initButton, initA, initLi, initUl, initHr} from './commonDomComponents.js';

let blockName = 'drop-down-menu'; // ddm = drop-down-menu

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;
    #contentCnt;

    constructor(parentDiv, menuData, enableHover=false, btnFaIcon = {prefix: 'solid', icon: 'bars'}, btnLabel='', contentPosition){
        if (contentPosition !== 'left' && contentPosition !== 'right')
            contentPosition = 'center';
        this.#dropDownDiv = initDiv(blockName);
        this.#button = initButton(`${blockName}__button`, this.#buttonClickCallback, btnFaIcon, btnLabel);
        this.#contentCnt = initDiv([`${blockName}__content-container`, `${blockName}__content-container--align--${contentPosition}`]);
        this.#content = initUl(`${blockName}__content`);

        menuData.forEach(data => {
            this.addItem(data);
        });

        this.#dropDownDiv.appendChild(this.#button);
        this.#contentCnt.appendChild(this.#content);
        this.#dropDownDiv.appendChild(this.#contentCnt);
        parentDiv.appendChild(this.#dropDownDiv);

        this.#content.addEventListener('click', this.#contentClickCallback);
        if (enableHover){
            this.#button.addEventListener('pointerenter', this.#buttonPointerEnterCallback);
            this.#dropDownDiv.addEventListener('pointerleave', this.#buttonPointerLeaveCallback);
        }
    }

    addItem(data){
        if (data.label === null){ // separator
            const separator = initHr(`${blockName}__separator`);
            this.#content.appendChild(separator);
            return;
        }

        let liChild;

        if (data.link){ // anchor
            liChild = initA(`${blockName}__anchor`, data.link, data.faIcon,data.label);
        } else if (data.action){ // action
            liChild = initButton(`${blockName}__action`, data.action, data.faIcon, data.label);
        } else { // label
            liChild = initP(`${blockName}__label`, data.faIcon,data.label);
        }

        const li = initLi(this.#content, `${blockName}__item`);
        li.appendChild(liChild);
    }

    toggleVisibility(condition=undefined){
        this.#contentCnt.classList.toggle(`${blockName}__content-container--visible`,condition);
    }

    toggleForcedVisibility(condition=undefined){
        this.#contentCnt.classList.toggle(`${blockName}__content-container--visible-forced`,condition);
    }
 
    // Event listeners callbacks ----------------------------------------------
    // see https://alephnode.io/07-event-handler-binding/
    #buttonClickCallback = () => {
        this.toggleForcedVisibility();
    };
    #buttonPointerEnterCallback = (e) => {
        if (e.pointerType === "mouse")
            this.toggleVisibility(true);
    };
    #buttonPointerLeaveCallback = (e) => {
        if (e.pointerType === "mouse")
            this.toggleVisibility(false);
    };
    #contentClickCallback = () => {
        this.toggleForcedVisibility(false);
        this.toggleVisibility(false);
    };
}
