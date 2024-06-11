import './ImageCarousel.css';
// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

export default class ImageCarousel{
    #imageCarouselDiv;
    #imagesDiv;
    #numOfImgs;
    #currentImg=0;
    #navigationDiv;
    #slideTimeoutObj = null;
    #slideTimeoutInMs;

    #iconsData = {
        navigationDotDataPrefix: 'fa-regular',
        navigationDotDataPrefixCurrent: 'fa-solid',
        navigationDotDataIcon: 'fa-circle',
        previousData: 'fa-solid fa-chevron-left',
        nextData: 'fa-solid fa-chevron-right'
    };

    constructor(parentDiv,imagesPaths,slideTimeoutInMs=5000){
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

        parentDiv.appendChild(this.#imageCarouselDiv);

        // initalize timeout to advance slides automatically
        this.#slideTimeoutInMs = slideTimeoutInMs;
        this.#initSlideTimeout();
    }

    #initFrameDivWithImages(imagesPaths){
        this.#imagesDiv = document.createElement('div');
        this.#imagesDiv.classList.add('image-carousel-slides');

        this.#numOfImgs = imagesPaths.length;
        imagesPaths.forEach(imgPath => {
            const img = document.createElement('img');
            img.setAttribute('src',imgPath);
            this.#imagesDiv.appendChild(img);
        });

        const frameDiv = document.createElement('div');
        frameDiv.classList.add('image-carousel-frame');
        frameDiv.appendChild(this.#imagesDiv);

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

            if (i===this.#currentImg)
                iconDataPrefix = this.#iconsData.navigationDotDataPrefixCurrent;
            else
                iconDataPrefix = this.#iconsData.navigationDotDataPrefix;
            slideDotButton.innerHTML = this.#getIconHTML(`${iconDataPrefix} ${iconDataIcon}`);

            slideDotButton.addEventListener('click',() => {this.#showSlide(i);});
            navigationDiv.appendChild(slideDotButton);
        }
        return navigationDiv;
    }

    #initSlideTimeout(){
        this.#slideTimeoutObj = setTimeout(() => {this.#next();}, this.#slideTimeoutInMs);
    }
    #cancelSlideTimeout(){
        clearTimeout(this.#slideTimeoutObj);
    }

    #getValidIdx(idx){
        let mod = (x,n) => ((x % n) + n) % n;
        return mod(idx, this.#numOfImgs);
    }

    #showSlide(idx=0){
        this.#cancelSlideTimeout();
        idx = this.#getValidIdx(idx);
        this.#unselectCurrentSlideIcon();
        this.#imagesDiv.style.left = `-${idx*100}%`;
        this.#currentImg = idx;
        this.#selectCurrentSlideIcon();
        this.#initSlideTimeout(this.#slideTimeoutInMs);
    }

    #previous(){
        this.#showSlide(this.#currentImg - 1);
    }

    #next(){
        this.#showSlide(this.#currentImg + 1);
    }

    #getIconHTML(icon){
        return `<i class="${icon} fa-fw" aria-hidden="true"></i>`;
    }
    #changeIconHTML(iconHtml,dataPrefix=undefined,dataIcon=undefined){
        if (dataPrefix)
            iconHtml.setAttribute('data-prefix', dataPrefix);
        if (dataIcon)
            iconHtml.setAttribute('data-icon', dataIcon);
    }

    #getSlideDot(idx){
        return this.#navigationDiv.children[idx].children[0];
    }
    #selectCurrentSlideIcon(){
        const currentSlideDot = this.#getSlideDot(this.#currentImg);
        const iconDataPrefix = this.#iconsData.navigationDotDataPrefixCurrent; 
        this.#changeIconHTML(currentSlideDot,iconDataPrefix);
    }
    #unselectCurrentSlideIcon(){
        const currentSlideDot = this.#getSlideDot(this.#currentImg);
        const iconDataPrefix = this.#iconsData.navigationDotDataPrefix;
        this.#changeIconHTML(currentSlideDot,iconDataPrefix);
    }
}