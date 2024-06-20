import './DropDownMenu.css';
import {initDiv, initP, initButton, initA, initLiAsChildInList, initUl, initHr} from './commonDomComponents.js';
import {changeChildFaIcon} from './fontAwesomeUtilities.js';

const blockName = 'drop-down-menu';
const alignValues = ['center','left','right'];
const cssClass = {
    dropDownDiv: blockName,
    button: `${blockName}__button`,
    contentCnt: `${blockName}__content-container`,
    content: `${blockName}__content`,
    separator: `${blockName}__separator`,
    item: `${blockName}__item`,
    anchor: `${blockName}__anchor`,
    label: `${blockName}__label`,
    action: `${blockName}__action`,
}
// For contentCntAlign, use the first value in alignValues as default value in case of wrong align label argument
cssClass.contentCntAlign = (align) => `${cssClass.contentCnt}--align--${alignValues.includes(align) ? align : alignValues[0]}`;
cssClass.contentCntVisible = `${cssClass.contentCnt}--visible`;
cssClass.contentCntVisibleForced = `${cssClass.contentCnt}--visible-forced`;

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;
    #contentCnt;

    #buttonFaIcons = {
        normal: {prefix: 'solid', icon: 'bars'},
        forced: {prefix: 'solid', icon: 'xmark'}
    };

    constructor(parentDiv, menuData, enableHover=false, btnFaIcon = {prefix: 'solid', icon: 'bars'}, btnLabel='', align = 'center'){
        this.#dropDownDiv = initDiv(cssClass.dropDownDiv);
        this.#button = initButton(cssClass.button, this.#buttonClickCallback, btnFaIcon, '', btnLabel);
        this.#contentCnt = initDiv([cssClass.contentCnt, cssClass.contentCntAlign(align)]);
        this.#content = initUl(cssClass.content);

        menuData.forEach(data => {
            this.addItem(data);
        });

        this.#contentCnt.appendChild(this.#content);
        this.#dropDownDiv.appendChild(this.#button);
        this.#dropDownDiv.appendChild(this.#contentCnt);
        parentDiv.appendChild(this.#dropDownDiv);

        this.#content.addEventListener('click', this.#contentClickCallback);
        if (enableHover){
            this.#button.addEventListener('pointerenter', this.#buttonPointerEnterCallback);
            this.#dropDownDiv.addEventListener('pointerleave', this.#buttonPointerLeaveCallback);
        }
    }

    getElement(){
        return this.#dropDownDiv;
    }

    addItem(data){
        if (data.label === null){ // separator
            const separator = initHr(cssClass.separator);
            this.#content.appendChild(separator);
            return;
        }

        const li = initLiAsChildInList(this.#content, cssClass.item);
        if (data.link){ // anchor
            li.appendChild(initA(cssClass.anchor, data.link, data.faIcon, '', data.label));
        } else if (data.action){ // action
            li.appendChild(initButton(cssClass.action, data.action, data.faIcon, '', data.label));
        } else { // label
            li.appendChild(initP(cssClass.label, data.faIcon, '', data.label));
        }
    }

    toggleVisibility(condition=undefined){
        this.#contentCnt.classList.toggle(cssClass.contentCntVisible,condition);
    }

    toggleForcedVisibility(condition=undefined){
        const isForced = this.#contentCnt.classList.toggle(cssClass.contentCntVisibleForced,condition);
        this.#setForcedVisisbilityFaIcon(isForced);
    }

    #setForcedVisisbilityFaIcon(isForced){
        if (isForced){
            changeChildFaIcon(this.#button, this.#buttonFaIcons.forced);
        } else {
            changeChildFaIcon(this.#button, this.#buttonFaIcons.normal);
        }
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
