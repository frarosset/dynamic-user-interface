export default class DropDownMenu{
    constructor(parentDiv){
        let dropDownDiv = document.createElement('div');
        dropDownDiv.classList.add('drop-down-menu');

        let button = document.createElement('button');
        button.classList.add('drop-down-button');
        button.textContent = '=';

        let content = document.createElement('ul');
        content.classList.add('drop-down-content');

        dropDownDiv.appendChild(button);
        dropDownDiv.appendChild(content);
        parentDiv.appendChild(dropDownDiv);
    }
}
