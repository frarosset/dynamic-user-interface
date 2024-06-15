import {setFaIconAndLabel} from './fontAwesomeUtilities.js';

// For passing methods as callbacks, see: https://alephnode.io/07-event-handler-binding/

export function initDiv(className=null){
    const element = document.createElement('div');
    applyClass(element, className);
    return element;
}

export function initP(className=null, faIcon= null, label= ''){
    const element = document.createElement('p');
    applyClass(element, className);
    setFaIconAndLabel(element,faIcon, label);
    return element;
}

export function initButton(className=null, clickCallback= () => {}, faIcon= null, label= ''){
    const element = document.createElement('button');
    applyClass(element, className);
    setFaIconAndLabel(element,faIcon, label);
    element.addEventListener('click', clickCallback);
    return element;
}

export function initA(className=null, href='', faIcon= null, label= '', target='_self'){
    const element = document.createElement('a');
    applyClass(element, className);
    setFaIconAndLabel(element,faIcon, label);
    element.href = href;
    element.target = target; // '_blank' opens link in a new tab
    return element;
}

export function initImg(className=null, src='', alt= ''){
    const element = document.createElement('img');
    applyClass(element, className);
    element.src = src;
    element.alt = alt;
    return element;
}

export function initUl(className=null){
    const element = document.createElement('ul');
    applyClass(element, className);
    return element;
}

export function initOl(className=null){
    const element = document.createElement('ol');
    applyClass(element, className);
    return element;
}

export function initLi(parentList, className=null, faIcon= null, label= ''){
    const element = document.createElement('li');
    applyClass(element, className);
    setFaIconAndLabel(element,faIcon, label);
    parentList.appendChild(element);
    return element;
}

export function initHr(className=null){
    const element = document.createElement('hr');
    applyClass(element, className);
    return element;
}

function applyClass(element, className){
    if (!className)
        return;
    
    if (typeof className === 'string'){
        element.classList.add(className);
    } else {
        element.classList.add(...className);
    }
}