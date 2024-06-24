import { setFaIconInBetweenText } from "./fontAwesomeUtilities.js";

// For passing methods as callbacks, see: https://alephnode.io/07-event-handler-binding/

export function initDiv(className = null) {
  const element = document.createElement("div");
  applyClass(element, className);
  return element;
}

export function initP(
  className = null,
  faIcon = null,
  textPre = "",
  textPost = ""
) {
  const element = document.createElement("p");
  applyClass(element, className);
  setFaIconInBetweenText(element, faIcon, textPre, textPost);
  return element;
}

export function initButton(
  className = null,
  clickCallback = () => {},
  faIcon = null,
  textPre = "",
  textPost = ""
) {
  const element = document.createElement("button");
  applyClass(element, className);
  setFaIconInBetweenText(element, faIcon, textPre, textPost);
  element.addEventListener("click", clickCallback);
  return element;
}

export function initA(
  className = null,
  href = "",
  faIcon = null,
  textPre = "",
  textPost = "",
  target = "_self"
) {
  const element = document.createElement("a");
  applyClass(element, className);
  setFaIconInBetweenText(element, faIcon, textPre, textPost);
  element.href = href;
  element.target = target; // '_blank' opens link in a new tab
  return element;
}

export function initImg(className = null, src = "", alt = "") {
  const element = document.createElement("img");
  applyClass(element, className);
  element.src = src;
  element.alt = alt;
  return element;
}

export function initUl(className = null) {
  const element = document.createElement("ul");
  applyClass(element, className);
  return element;
}

export function initOl(className = null) {
  const element = document.createElement("ol");
  applyClass(element, className);
  return element;
}

export function initLi(
  className = null,
  faIcon = null,
  textPre = "",
  textPost = ""
) {
  const element = document.createElement("li");
  applyClass(element, className);
  setFaIconInBetweenText(element, faIcon, textPre, textPost);
  return element;
}

export function initLiAsChildInList(
  parentList,
  className,
  faIcon = null,
  textPre = "",
  textPost = ""
) {
  const element = initLi(className, faIcon, textPre, textPost);
  parentList.appendChild(element);
  return element;
}

export function initHr(className = null) {
  const element = document.createElement("hr");
  applyClass(element, className);
  return element;
}

function applyClass(element, className) {
  if (!className) return;

  if (typeof className === "string") {
    element.classList.add(className);
  } else {
    element.classList.add(...className);
  }
}
