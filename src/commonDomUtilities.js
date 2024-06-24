// For passing methods as callbacks, see: https://alephnode.io/07-event-handler-binding/

// The next function is based on
// https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
export function initHorizontalSwipeDetection(
  element,
  callbackLeft = () => {},
  callbackRight = () => {}
) {
  let xTouchStart;

  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  element.addEventListener("touchstart", (e) => {
    xTouchStart = e.changedTouches[0].screenX;
  });

  element.addEventListener("touchend", (e) => {
    const xTouchEnd = e.changedTouches[0].screenX;
    const sensitivityInPixel = 10;
    const delta = xTouchEnd - xTouchStart;

    if (delta > sensitivityInPixel) {
      callbackRight();
    } else if (delta < -sensitivityInPixel) {
      callbackLeft();
    }
  });
}

export function triggerReflow(element) {
  element.offsetTop;
}
