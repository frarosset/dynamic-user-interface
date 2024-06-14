import './ImageCarousel.css';
// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

export default class ImageCarousel{
    #imageCarouselDiv;
    #imagesDiv;
    #navigationDiv;
    #stopResumeCyclingButton;

    #numOfImgs;
    #idxOfFirstImg;
    #idxOfLastImg;
    #idxOfAppendedFirstImg;
    #idxOfPrependedLastImg;

    #currentImgIdx; // 0, 1, ..., #numOfImgs-1 - the index of the shown image
    #idxForLeft; // #idxOfFirstImg, ..., #idxOfLastImg, #idxOfAppendedFirstImg - the index of the shown image in #imagesDiv

    #slideTimeoutObj = null;
    #slideTimeoutInMs;

    #autoCycling;
    #inTransition;

    #iconsData = {
        navigationDotDataPrefix: 'fa-regular',
        navigationDotDataPrefixCurrent: 'fa-solid',
        navigationDotDataIcon: 'fa-circle',
        previousData: 'fa-solid fa-chevron-left',
        nextData: 'fa-solid fa-chevron-right',
        cyclingButtonDataPrefix: 'fa-solid',
        cyclingButtonDataIcon: 'fa-pause',
        cyclingButtonDataIconStopped: 'fa-play'
    };

    constructor(parentDiv,imagesPaths,slideTimeoutInMs=5000, autoCycling=true){
        this.#imageCarouselDiv = document.createElement('div');
        this.#imageCarouselDiv.classList.add('image-carousel');

        // add frame div with images
        this.#imageCarouselDiv.appendChild(this.#initFrameDivWithImages(imagesPaths));

        // add interface (previous and next buttons)
        this.#imageCarouselDiv.appendChild(this.#initPreviousButton());
        this.#imageCarouselDiv.appendChild(this.#initNextButton());

        // add interface (previous and next buttons)
        this.#navigationDiv = this.#initNavigationDiv();
        this.#imageCarouselDiv.appendChild(this.#navigationDiv);

        // add stop/resume auto cycling of slide transition
        this.#stopResumeCyclingButton = this.#initStopResumeAutoCyclingButton(autoCycling);
        this.#imageCarouselDiv.appendChild(this.#stopResumeCyclingButton);

        parentDiv.appendChild(this.#imageCarouselDiv);

        // initalize timeout to advance slides automatically
        this.#initSlideTimeout(slideTimeoutInMs);

        if(autoCycling)
            this.#setSlideTimeout();
    }

    #initFrameDivWithImages(imagesPaths){
        this.#imagesDiv = document.createElement('div');
        this.#imagesDiv.classList.add('image-carousel-slides');

        // append first image at the end (but don't count it in the #numOfImages),
        // as well as prepend the last image at the beginning
        // ie, if you have N images, [i], for i=1,2,...N, in this.#imagesDiv you have:
        // [N'],[1],[2],[3],...,[N],[1']
        // this will be used to make a seamless transition N -> 1 or 1 -> N (see below)
        this.#numOfImgs = imagesPaths.length;
        [imagesPaths[this.#numOfImgs-1],...imagesPaths,imagesPaths[0]].forEach(imgPath => {
            const img = document.createElement('img');
            img.setAttribute('src',imgPath);
            this.#imagesDiv.appendChild(img);
        });
        this.#idxOfFirstImg = 1; // index of [1] (in this.#imagesDiv)
        this.#idxOfLastImg = this.#numOfImgs - 1 + this.#idxOfFirstImg; // index of [N]
        this.#idxOfAppendedFirstImg = this.#idxOfLastImg + 1; // index of [1']
        this.#idxOfPrependedLastImg = this.#idxOfFirstImg - 1; // index of [N']

        const frameDiv = document.createElement('div');
        frameDiv.classList.add('image-carousel-frame');
        frameDiv.appendChild(this.#imagesDiv);

        // when you do the slide transition N -> 1, first do
        // [N] -> [1'] (applying the transition duration defined in the .css file)
        // once this is completed, a 'transitionend' event is fired,
        // then, temporarily suspend the transition CSS property to make a
        // [1'] -> [1] transition instantaneously
        // (to do this, just just have to update the left property of this.#imagesDiv)
        // Similar considerations can be made for the 1->N transition
        this.#imagesDiv.addEventListener('transitionend' , ()=>{
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
        });

        // initialize the first image shown
        this.#setCurrentImgData(0);
        
        return frameDiv;
    }

    #initPreviousButton(){
        const previousButton = document.createElement('button');
        previousButton.classList.add('previous-button');
        previousButton.innerHTML = this.#getIconHTML(this.#iconsData.previousData);
        previousButton.addEventListener('click',() => {this.#previous();});
        return previousButton;
    }

    #initNextButton(){
        const nextButton = document.createElement('button');
        nextButton.classList.add('next-button');
        nextButton.innerHTML = this.#getIconHTML(this.#iconsData.nextData);
        nextButton.addEventListener('click',() => {this.#next();});
        return nextButton;
    }

    #initNavigationDiv(){
        const navigationDiv = document.createElement('div');
        navigationDiv.classList.add('image-carousel-navigation');

        let iconDataPrefix;
        const iconDataIcon = this.#iconsData.navigationDotDataIcon;

        for (let i=0; i<this.#numOfImgs; i++){
            const slideDotButton = document.createElement('button');
            slideDotButton.classList.add('slide-dot-button');

            if (i===this.#currentImgIdx)
                iconDataPrefix = this.#iconsData.navigationDotDataPrefixCurrent;
            else
                iconDataPrefix = this.#iconsData.navigationDotDataPrefix;
            slideDotButton.innerHTML = this.#getIconHTML(`${iconDataPrefix} ${iconDataIcon}`);

            slideDotButton.addEventListener('click',() => {this.#showSlide(i);});
            navigationDiv.appendChild(slideDotButton);
        }
        return navigationDiv;
    }

    #initStopResumeAutoCyclingButton(autoCycling){
        const stopResumeCyclingButton = document.createElement('button');
        stopResumeCyclingButton.classList.add('stop-resume-cycling-button');

        // auto cycling disabled by default
        this.#autoCycling = autoCycling;

        const iconDataIcon = autoCycling ? this.#iconsData.cyclingButtonDataIcon : this.#iconsData.cyclingButtonDataIconStopped;
        const iconDataPrefix = this.#iconsData.cyclingButtonDataPrefix;
        stopResumeCyclingButton.innerHTML = this.#getIconHTML(`${iconDataPrefix} ${iconDataIcon}`);

        stopResumeCyclingButton.addEventListener('click',() => {this.#toggleAutoCycling();});

        return stopResumeCyclingButton;
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

        const iconDataIcon = this.#iconsData.cyclingButtonDataIcon;
        this.#changeIconHTML(this.#stopResumeCyclingButton.children[0],null,iconDataIcon);
    }
    #cancelAutoCycling(){
        this.#cancelSlideTimeout(); // this sets the timeout only if this.#autoCycling is true
        this.#autoCycling = false; // // set this after!

        const iconDataIcon = this.#iconsData.cyclingButtonDataIconStopped;
        this.#changeIconHTML(this.#stopResumeCyclingButton.children[0],null,iconDataIcon);
    }

    #initSlideTimeout(slideTimeoutInMs){
        this.#slideTimeoutInMs = slideTimeoutInMs;

        // Suspend cycling animation of image sarousel when page visibility is hidden
        // - it saves resources when the page is not visible.
        // - it solves a bug where the navigation dots were not properly updated when the page 
        //   was not visible but the cycling was active.
        document.addEventListener("visibilitychange", () => {
            if (this.#autoCycling){
                if (document.visibilityState === "visible") {
                    this.#setSlideTimeout();
                } else { //document.visibilityState` === "hidden"
                    this.#cancelSlideTimeout();
                }
            }
        });
    }

    #setSlideTimeout(){
        if (this.#autoCycling){
            this.#slideTimeoutObj = setTimeout(() => {this.#next();}, this.#slideTimeoutInMs);
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
        this.#idxForLeft =  idxForLeft; 
        //this.#imagesDiv.style.left = `-${idxForLeft*100}%`;
        this.#imagesDiv.style.transform = `translateX(-${idxForLeft*100}%)`;
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

    #getIconHTML(icon){
        return `<i class="${icon} fa-fw" aria-hidden="true"></i>`;
    }
    #changeIconHTML(iconHtml,dataPrefix=undefined,dataIcon=undefined){
        if (dataPrefix)
            iconHtml.setAttribute('data-prefix', dataPrefix);
        if (dataIcon)
            iconHtml.setAttribute('data-icon', dataIcon.slice(3));
    }

    #getSlideDot(imgIdx){
        return this.#navigationDiv.children[imgIdx].children[0];
    }
    #selectCurrentSlideIcon(){
        const currentSlideDot = this.#getSlideDot(this.#currentImgIdx);
        const iconDataPrefix = this.#iconsData.navigationDotDataPrefixCurrent; 
        this.#changeIconHTML(currentSlideDot,iconDataPrefix);
    }
    #unselectCurrentSlideIcon(){
        const currentSlideDot = this.#getSlideDot(this.#currentImgIdx);
        const iconDataPrefix = this.#iconsData.navigationDotDataPrefix;
        this.#changeIconHTML(currentSlideDot,iconDataPrefix);
    }

    #suspendTransitionToCall(callback){
        this.#imagesDiv.classList.add('suspend-transition');
        // trigger a reflow to be sure the above class is applied
        this.#triggerReflow(this.#imagesDiv); 
        
        callback();
        // trigger a reflow to be sure any operation on this.#imagesDiv is applied    
        this.#triggerReflow(this.#imagesDiv); 
        
        this.#imagesDiv.classList.remove('suspend-transition');
    }

    #triggerReflow(element){
        element.offsetTop;
    }
}