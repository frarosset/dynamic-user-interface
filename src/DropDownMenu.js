import './DropDownMenu.css';
import {initDiv, initP, initButton, initA, initLi, initUl, initHr} from './commonDomComponents.js';

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;

    constructor(parentDiv, menuData, enableHover=false, btnFaIcon = {prefix: 'solid', icon: 'bars'}, btnLabel='', contentPosition){
        if (contentPosition !== 'left' && contentPosition !== 'right')
            contentPosition = 'center';
        this.#dropDownDiv = initDiv(['drop-down-menu', `content-align-${contentPosition}`]);
        this.#button = initButton('drop-down-button', () => {this.toggleForcedVisibility();}, btnFaIcon, btnLabel);
        let contentCnt = initDiv('drop-down-content-cnt');
        this.#content = initUl('drop-down-content');

        menuData.forEach(data => {
            this.addItem(data);
        });

        this.#dropDownDiv.appendChild(this.#button);
        contentCnt.appendChild(this.#content);
        this.#dropDownDiv.appendChild(contentCnt);
        parentDiv.appendChild(this.#dropDownDiv);

        this.#content.addEventListener('click', () => {
            this.toggleForcedVisibility(false);
            this.toggleVisibility(false);
        });
        if (enableHover){
            this.#button.addEventListener('pointerenter', (e) => {
                if (e.pointerType === "mouse")
                    this.toggleVisibility(true);
            });
            this.#dropDownDiv.addEventListener('pointerleave', (e) => {
                if (e.pointerType === "mouse")
                    this.toggleVisibility(false);
            });
        }
    }

    addItem(data){
        if (data.label === null){ // separator
            const separator = initHr('separator');
            this.#content.appendChild(separator);
            return;
        }

        let liClass;
        let liChild;

        if (data.link){ // anchor
            liClass = 'anchor';
            liChild = initA('', data.link, data.faIcon,data.label);
        } else if (data.action){ // action
            liClass = 'action';
            liChild = initButton('', data.action, data.faIcon, data.label);
        } else { // label
            liClass = 'label';
            liChild = initP('', data.faIcon,data.label);
        }

        const li = initLi(this.#content, liClass);
        li.appendChild(liChild);
    }

    toggleVisibility(condition=undefined){
        this.#dropDownDiv.classList.toggle('visible',condition);
    }

    toggleForcedVisibility(condition=undefined){
        this.#dropDownDiv.classList.toggle('visible-forced',condition);
    }
}
