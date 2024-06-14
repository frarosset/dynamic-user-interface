import './DropDownMenu.css';
import {setFaIconAndLabel} from './fontAwesomeUtilities.js';

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;

    constructor(parentDiv, menuData, enableHover=false, btnFaIcon = {prefix: 'solid', icon: 'bars'}, btnLabel='', contentPosition){
        this.#dropDownDiv = document.createElement('div');
        this.#dropDownDiv.classList.add('drop-down-menu');
        if (contentPosition !== 'left' && contentPosition !== 'right')
            contentPosition = 'center';
        this.#dropDownDiv.classList.add('content-align-' + contentPosition);

        this.#button = document.createElement('button');
        this.#button.classList.add('drop-down-button');
        setFaIconAndLabel(this.#button,btnFaIcon,btnLabel);

        let contentCnt = document.createElement('div');
        contentCnt.classList.add('drop-down-content-cnt');

        this.#content = document.createElement('ul');
        this.#content.classList.add('drop-down-content');

        menuData.forEach(data => {
            this.addItem(data);
        });

        this.#dropDownDiv.appendChild(this.#button);
        contentCnt.appendChild(this.#content);
        this.#dropDownDiv.appendChild(contentCnt);
        parentDiv.appendChild(this.#dropDownDiv);

        this.#button.addEventListener('click', () => {
            this.#toggleForcedVisibility(this.#dropDownDiv);
        });
        this.#content.addEventListener('click', () => {
            this.#toggleForcedVisibility(this.#dropDownDiv,false);
            this.#toggleVisibility(this.#dropDownDiv,false);
        });
        if (enableHover){
            this.#button.addEventListener('pointerenter', (e) => {
                if (e.pointerType === "mouse")
                    this.#toggleVisibility(this.#dropDownDiv,true);
            });
            this.#dropDownDiv.addEventListener('pointerleave', (e) => {
                if (e.pointerType === "mouse")
                    this.#toggleVisibility(this.#dropDownDiv,false);
            });
        }
    }

    addItem(data){
        if (data.label === null){
            // separator
            const separator = document.createElement('hr');
            separator.classList.add('separator');
            this.#content.appendChild(separator);
            return;
        }

        const item = document.createElement('li');
        if (data.link){
            // anchor
            const anchor = document.createElement('a');
            anchor.href = data.link;
            //anchor.target = '_blank'; // Opens link in a new tab
            setFaIconAndLabel(anchor,data.faIcon,data.label);

            item.classList.add('anchor');
            item.appendChild(anchor);
        } else if (data.action){
            // action
            const action = document.createElement('button');
            action.addEventListener('click', data.action);
            setFaIconAndLabel(action,data.faIcon,data.label);

            item.classList.add('action');
            item.appendChild(action);
        } else {
            item.classList.add('label');
            setFaIconAndLabel(item,data.faIcon,data.label);
        }

        this.#content.appendChild(item);
    }

    #toggleVisibility(element,condition=undefined){
        element.classList.toggle('visible',condition);
    }
    #toggleForcedVisibility(element,condition=undefined){
        element.classList.toggle('visible-forced',condition);
    }
}
