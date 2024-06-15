// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

export function getFaIconHTML(faIcon, fullWidth = true){
    return `<i class="fa-${faIcon.prefix} fa-${faIcon.icon} ${fullWidth ? 'fa-fw' : ''}" aria-hidden="true"></i>`;
}

export function setFaIconAndLabel(element,faIcon,label=''){
    if (faIcon){
        element.innerHTML = `${getFaIconHTML(faIcon)}${label}`;
    } else {
        element.textContent = label;
    }
}

export function setFaIcon(element,faIcon){
    if (faIcon){
        element.innerHTML = `${getFaIconHTML(faIcon)}`;
    }
}

export function changeFaIcon(element,faIcon = {prefix: null, icon: null}){
    const iconSVG = element.children[0];
    if (faIcon.prefix){
        iconSVG.setAttribute('data-prefix', `fa-${faIcon.prefix}`);
    } 
    if (faIcon.icon){
        iconSVG.setAttribute('data-icon', faIcon.icon);
    }
}
