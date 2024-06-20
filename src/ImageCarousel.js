import './ImageCarousel.css';
import {changeChildFaIcon} from './fontAwesomeUtilities.js';
import {initDiv, initImg, initButton} from './commonDomComponents.js';
import {triggerReflow,initHorizontalSwipeDetection} from './commonDomUtilities.js';




const blockName = 'image-carousel';
const cssClass = {
    imageCarouselDiv: blockName,
    frame: `${blockName}__frame`,
    slides: `${blockName}__slides`,
    img: `${blockName}__img`,
    previousButton: `${blockName}__previous-button`,
    nextButton: `${blockName}__next-button`,
    navigation: `${blockName}__navigation`,
    autoCyclingButton: `${blockName}__auto-cycling-button`,
    slideDotButton: `${blockName}__img-button`,
}
cssClass.slidesTransitionOff = `${cssClass.slides}--transition-off`;
cssClass.imgCurrent = `${cssClass.img}--current`;
cssClass.slideDotButtonCurrent = `${cssClass.slideDotButton}--current`;



export default class ImageCarousel{
    #imageCarouselDiv;
    #imagesDiv;
    #navigationDiv;
    #autoCyclingButton;

    #numOfImgs;
    #idxOfFirstImg;
    #idxOfLastImg;
    #idxOfAppendedFirstImg;
    #idxOfPrependedLastImg;

    #currentImgIdx; // 0, 1, ..., #numOfImgs-1 - the index of the shown image
    #idxForLeft=0; // #idxOfFirstImg, ..., #idxOfLastImg, #idxOfAppendedFirstImg - the index of the shown image in #imagesDiv

    #slideTimeoutObj = null;
    #slideTimeoutInMs;

    #autoCycling;
    #inTransition;

    #faIcons = {
        navigationDot: {prefix: 'regular', icon: 'circle'},
        currentNavigationDot: {prefix: 'solid', icon: 'circle'},
        previousBtn: {prefix: 'solid', icon: 'chevron-left'},
        nextBtn: {prefix: 'solid', icon: 'chevron-right'},
        playCyclingBtn: {prefix: 'solid', icon: 'play'},
        pauseCyclingBtn: {prefix: 'solid', icon: 'pause'},
    };

    constructor(parentDiv,imagesPaths,slideTimeoutInMs=5000, autoCycling=true){
        this.#imageCarouselDiv = initDiv(cssClass.imageCarouselDiv);

        // add frame div with images
        this.#imageCarouselDiv.appendChild(this.#initFrameDivWithImages(imagesPaths));

        // add interface (previous and next buttons)
        const previousButton = initButton(cssClass.previousButton, this.#previousButtonClickCallback, this.#faIcons.previousBtn);
        this.#imageCarouselDiv.appendChild(previousButton);
        const nextButton = initButton(cssClass.nextButton, this.#nextButtonClickCallback, this.#faIcons.nextBtn);
        this.#imageCarouselDiv.appendChild(nextButton);

        // add interface (previous and next buttons)
        this.#navigationDiv = this.#initNavigationDiv();
        this.#imageCarouselDiv.appendChild(this.#navigationDiv);

        // add stop/resume auto cycling of slide transition
        this.#autoCyclingButton = this.#initStopResumeAutoCyclingButton(autoCycling);
        this.#imageCarouselDiv.appendChild(this.#autoCyclingButton);

        parentDiv.appendChild(this.#imageCarouselDiv);

        // initalize timeout to advance slides automatically
        this.#initSlideTimeout(slideTimeoutInMs);

        if(autoCycling)
            this.#setSlideTimeout();
    }

    #initFrameDivWithImages(imagesPaths){
        this.#imagesDiv = initDiv(cssClass.slides);

        // append first image at the end (but don't count it in the #numOfImages),
        // as well as prepend the last image at the beginning
        // ie, if you have N images, [i], for i=1,2,...N, in this.#imagesDiv you have:
        // [N'],[1],[2],[3],...,[N],[1']
        // this will be used to make a seamless transition N -> 1 or 1 -> N (see below)
        this.#numOfImgs = imagesPaths.length;
        [imagesPaths[this.#numOfImgs-1],...imagesPaths,imagesPaths[0]].forEach((imgPath,i) => {
            const img = initImg(cssClass.img, imgPath, 'A slide of the image carousel.')
            this.#imagesDiv.appendChild(img);
        });
        this.#idxOfFirstImg = 1; // index of [1] (in this.#imagesDiv)
        this.#idxOfLastImg = this.#numOfImgs - 1 + this.#idxOfFirstImg; // index of [N]
        this.#idxOfAppendedFirstImg = this.#idxOfLastImg + 1; // index of [1']
        this.#idxOfPrependedLastImg = this.#idxOfFirstImg - 1; // index of [N']

        const frameDiv = initDiv(cssClass.frame);
        frameDiv.appendChild(this.#imagesDiv);

        // when you do the slide transition N -> 1, first do
        // [N] -> [1'] (applying the transition duration defined in the .css file)
        // once this is completed, a 'transitionend' event is fired,
        // then, temporarily suspend the transition CSS property to make a
        // [1'] -> [1] transition instantaneously
        // (to do this, just just have to update the left property of this.#imagesDiv)
        // Similar considerations can be made for the 1->N transition
        this.#imagesDiv.addEventListener('transitionend' , this.#imageDivTransitionendCallback);

        // simulate next/previous clicks with swipes
        initHorizontalSwipeDetection(frameDiv,this.#nextButtonClickCallback,this.#previousButtonClickCallback);

        // initialize the first image shown
        this.#setCurrentImgData(0);
        
        return frameDiv;
    }
    
    #initNavigationDiv(){
        const navigationDiv = initDiv(cssClass.navigation);

        const getFaIcon = (i) => {
            return i===this.#currentImgIdx ? this.#faIcons.currentNavigationDot : this.#faIcons.navigationDot; 
        };

        for (let i=0; i<this.#numOfImgs; i++){
            const slideDotButton = initButton(cssClass.slideDotButton, this.#slideDotButtonClickCallback, getFaIcon(i));
            slideDotButton.i = i;
            navigationDiv.appendChild(slideDotButton);
        }

        return navigationDiv;
    }

    #initStopResumeAutoCyclingButton(autoCycling){
        const getFaIcon = () => {
            return autoCycling ? this.#faIcons.pauseCyclingBtn : this.#faIcons.playCyclingBtn; 
        };

        const autoCyclingButton = initButton(cssClass.autoCyclingButton, this.#autoCyclingButtonClickCallback, getFaIcon());

        // auto cycling disabled by default
        this.#autoCycling = autoCycling;

        return autoCyclingButton;
    }

    #toggleAutoCycling(){
        if (this.#autoCycling){
            this.#cancelAutoCycling();
        } else {
            this.#setAutoCycling();
        }
    }
    #setAutoCycling(){
        this.#autoCycling = true; // set this first!
        this.#setSlideTimeout(); // this sets the timeout only if this.#autoCycling is true

        const faIcon = this.#faIcons.pauseCyclingBtn;
        changeChildFaIcon(this.#autoCyclingButton,faIcon);
    }
    #cancelAutoCycling(){
        this.#cancelSlideTimeout(); // this sets the timeout only if this.#autoCycling is true
        this.#autoCycling = false; // // set this after!

        const faIcon = this.#faIcons.playCyclingBtn;
        changeChildFaIcon(this.#autoCyclingButton,faIcon);
    }

    #initSlideTimeout(slideTimeoutInMs){
        this.#slideTimeoutInMs = slideTimeoutInMs;

        // Suspend cycling animation of image sarousel when page visibility is hidden
        // - it saves resources when the page is not visible.
        // - it solves a bug where the navigation dots were not properly updated when the page 
        //   was not visible but the cycling was active.
        document.addEventListener("visibilitychange", this.#documentVisibilitychangeCallback);
    }

    #setSlideTimeout(){
        if (this.#autoCycling){
            // simulate a #nextButton click
            this.#slideTimeoutObj = setTimeout(this.#nextButtonClickCallback, this.#slideTimeoutInMs);
        }
    }
    #cancelSlideTimeout(){
        if (this.#autoCycling){
            clearTimeout(this.#slideTimeoutObj);
        }
    }

    #getValidImg(imgIdx){
        let mod = (x,n) => ((x % n) + n) % n;
        return mod(imgIdx, this.#numOfImgs);
    }

    #setCurrentImgData(imgIdx){
        this.#currentImgIdx = this.#getValidImg(imgIdx);
        const idxForLeft = this.#getIdxForLeft(imgIdx);
        this.#setImagesDivLeft(idxForLeft);
    }

    #setImagesDivLeft(idxForLeft){
        this.#unselectCurrentSlideImg();
        this.#idxForLeft =  idxForLeft; 
        //this.#imagesDiv.style.left = `-${idxForLeft*100}%`;
        this.#imagesDiv.style.transform = `translateX(-${idxForLeft*100}%)`;
        this.#selectCurrentSlideImg();
    }

    #getIdxForLeft(imgIdx){
        let idx = imgIdx + this.#idxOfFirstImg; 
        if (idx === this.#idxOfAppendedFirstImg || idx === this.#idxOfPrependedLastImg){
                return idx;
        } else {
            return this.#currentImgIdx + this.#idxOfFirstImg;
        } 
    }

    #showSlide(imgIdx=0){
        this.#cancelSlideTimeout();
        this.#unselectCurrentSlideIcon();

        if (imgIdx !== this.#currentImgIdx && !this.#inTransition){
            // imgIdx !== this.#currentImgIdx: ensure a transition occurs, 
            //   to trigger the transitionend event
            // !this.#inTransition: don't trigger a new transition if there is
            //   one in progress (to avoid non-seamless transitions between slides 1 and N)
            this.#inTransition = true;
            this.#setCurrentImgData(imgIdx);
        }

        this.#selectCurrentSlideIcon();
        this.#setSlideTimeout();
    }

    #previous(){
        this.#showSlide(this.#currentImgIdx - 1);
    }

    #next(){
        this.#showSlide(this.#currentImgIdx + 1);
    }

    #getSlideDot(imgIdx){
        return this.#navigationDiv.children[imgIdx];
    }
    #selectCurrentSlideIcon(){
        const currentSlideDot = this.#getSlideDot(this.#currentImgIdx);
        currentSlideDot.classList.add(cssClass.slideDotButtonCurrent);
        const faIcon = this.#faIcons.currentNavigationDot; 
        changeChildFaIcon(currentSlideDot,faIcon);
    }
    #unselectCurrentSlideIcon(){
        const currentSlideDot = this.#getSlideDot(this.#currentImgIdx);
        currentSlideDot.classList.remove(cssClass.slideDotButtonCurrent);
        const faIcon = this.#faIcons.navigationDot; 
        changeChildFaIcon(currentSlideDot,faIcon);
    }
   
    #selectCurrentSlideImg(){
        this.#imagesDiv.children[this.#idxForLeft].classList.add(cssClass.imgCurrent);
        if (this.#idxForLeft===this.#idxOfAppendedFirstImg){
            this.#imagesDiv.children[this.#idxOfFirstImg].classList.add(cssClass.imgCurrent);
        } else if (this.#idxForLeft===this.#idxOfPrependedLastImg){
            this.#imagesDiv.children[this.#idxOfLastImg].classList.add(cssClass.imgCurrent);
        }
    }
    #unselectCurrentSlideImg(){
        this.#imagesDiv.children[this.#idxForLeft].classList.remove(cssClass.imgCurrent);
        if (this.#idxForLeft===this.#idxOfFirstImg){
            this.#imagesDiv.children[this.#idxOfAppendedFirstImg].classList.remove(cssClass.imgCurrent);
        } else if (this.#idxForLeft===this.#idxOfLastImg){
            this.#imagesDiv.children[this.#idxOfPrependedLastImg].classList.remove(cssClass.imgCurrent);
        }
    }

    #suspendTransitionToCall(callback){
        this.#imagesDiv.classList.add(cssClass.slidesTransitionOff);
        // trigger a reflow to be sure the above class is applied
        triggerReflow(this.#imagesDiv); 
        
        callback();
        // trigger a reflow to be sure any operation on this.#imagesDiv is applied    
        triggerReflow(this.#imagesDiv); 
        
        this.#imagesDiv.classList.remove(cssClass.slidesTransitionOff);
    }

    // Event listeners callbacks ----------------------------------------------
    // see https://alephnode.io/07-event-handler-binding/
    #previousButtonClickCallback = () => {
        this.#previous();
    };
    #nextButtonClickCallback = () => {
        this.#next();
    };
    #slideDotButtonClickCallback = (e) => {
        this.#suspendTransitionToCall(() => {
            this.#showSlide(e.currentTarget.i); // currentTarget: element that the event listener is attached to
            this.#inTransition=false;
        });
    };
    #autoCyclingButtonClickCallback = () => {
        this.#toggleAutoCycling();
    };
    #documentVisibilitychangeCallback = () => {
        if (this.#autoCycling){
            if (document.visibilityState === "visible") {
                this.#setSlideTimeout();
            } else { //document.visibilityState` === "hidden"
                this.#cancelSlideTimeout();
            }
        }
    };
    #imageDivTransitionendCallback = ()=>{
        // in this.#imagesDiv you have: [N'],[1],[2],[3],...,[N],[1']
        if (this.#idxForLeft === this.#idxOfAppendedFirstImg){
            // transition [N] -> [1'] has just ended, so go to [1] without transition
            this.#suspendTransitionToCall(() => {
                this.#setImagesDivLeft(this.#idxOfFirstImg);
            });
        } else if (this.#idxForLeft === this.#idxOfPrependedLastImg){
            // transition [1] -> [N'] has just ended, so go to [N] without transition
            this.#suspendTransitionToCall(() => {
                this.#setImagesDivLeft(this.#idxOfLastImg);
            });
        }
        this.#inTransition=false;
    };
}