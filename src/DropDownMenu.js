import './DropDownMenu.css';

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;
    #items = [];

    constructor(parentDiv, menuData, enableHover=false){
        this.#dropDownDiv = document.createElement('div');
        this.#dropDownDiv.classList.add('drop-down-menu');

        this.#button = document.createElement('button');
        this.#button.classList.add('drop-down-button');
        this.#button.textContent = '=';

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

        if (data.link){
            const anchor = document.createElement('a');
            anchor.href = data.link;
            //anchor.target = '_blank'; // Opens link in a new tab
            anchor.textContent = data.label;

            item.classList.add('anchor');
            item.appendChild(anchor);
        } else {
            item.textContent = data.label;
        }

        this.#items.push(item);
        this.#content.appendChild(item);
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
