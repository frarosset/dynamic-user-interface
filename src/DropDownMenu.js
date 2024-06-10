import './DropDownMenu.css';
// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid' // https://fontawesome.com/icons?d=gallery&s=solid&m=free
import '@fortawesome/fontawesome-free/js/regular' // https://fontawesome.com/icons?d=gallery&s=regular&m=free
import '@fortawesome/fontawesome-free/js/brands' // https://fontawesome.com/icons?d=gallery&s=brands&m=free

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;
    #items = [];

    constructor(parentDiv, menuData, enableHover=false, btnIcon='fa-solid fa-bars', btnLabel=''){
        this.#dropDownDiv = document.createElement('div');
        this.#dropDownDiv.classList.add('drop-down-menu');

        this.#button = document.createElement('button');
        this.#button.classList.add('drop-down-button');
        this.#setIconAndLabel(this.#button,btnIcon,btnLabel);

        this.#content = document.createElement('ul');
        this.#content.classList.add('drop-down-content');

        menuData.forEach(data => {
            console.log(data);
            this.addItem(data);
        });

        this.#dropDownDiv.appendChild(this.#button);
        this.#dropDownDiv.appendChild(this.#content);
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
        const item = document.createElement('li');
        if (data.label === null){
            // separator
            const separator = document.createElement('hr');

            item.classList.add('separator');
            item.appendChild(separator);
        } else if (data.link){
            // anchor
            const anchor = document.createElement('a');
            anchor.href = data.link;
            //anchor.target = '_blank'; // Opens link in a new tab
            this.#setIconAndLabel(anchor,data.icon,data.label);

            item.classList.add('anchor');
            item.appendChild(anchor);
        } else if (data.action){
            // action
            const action = document.createElement('button');
            action.addEventListener('click', data.action);
            this.#setIconAndLabel(action,data.icon,data.label);

            item.classList.add('action');
            item.appendChild(action);
        } else {
            item.classList.add('label');
            this.#setIconAndLabel(item,data.icon,data.label);
        }

        this.#items.push(item);
        this.#content.appendChild(item);
    }

    #setIconAndLabel(element,icon,label){
        if (icon){
            element.innerHTML = `${this.#getIconHTML(icon)}${label}`;
        } else {
            element.textContent = label;
        }
    }
    #getIconHTML(icon){
        return `<i class="${icon}" aria-hidden="true"></i>`;
    }

    #toggleVisibility(element,condition=undefined){
        element.classList.toggle('visible',condition);
        console.log('Toggle',condition);
    }
    #toggleForcedVisibility(element,condition=undefined){
        element.classList.toggle('visible-forced',condition);
        console.log('Toggle (forced)',condition);
    }


    
}
