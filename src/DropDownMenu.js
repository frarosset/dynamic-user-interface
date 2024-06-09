import './DropDownMenu.css';

export default class DropDownMenu{
    #dropDownDiv;
    #button;
    #content;
    #items = [];

    constructor(parentDiv, menuData){
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
    }

    addItem(data){
        // itmType: button, anchor
        let item = document.createElement('li');

        if (data.link){
            let anchor = document.createElement('a');
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
}
