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

    #iconsData = {
        navigationDotDataPrefix: 'fa-regular',
        navigationDotDataPrefixCurrent: 'fa-solid',
        navigationDotDataIcon: 'fa-circle',
        previousData: 'fa-solid fa-chevron-left',
        nextData: 'fa-solid fa-chevron-right'
    };

    constructor(parentDiv,imagesPaths){
        this.#imageCarouselDiv = document.createElement('div');
        this.#imageCarouselDiv.classList.add('image-carousel');

        const frameDiv = document.createElement('div');
        frameDiv.classList.add('image-carousel-frame');
        
        this.#imagesDiv = document.createElement('div');
        this.#imagesDiv.classList.add('image-carousel-slides');

        this.#numOfImgs = imagesPaths.length;
        imagesPaths.forEach(imgPath => {
            const img = document.createElement('img');
            img.setAttribute('src',imgPath);
            this.#imagesDiv.appendChild(img);
        });

        frameDiv.appendChild(this.#imagesDiv);
        this.#imageCarouselDiv.appendChild(frameDiv);

        // add interface (previous and next buttons)
        const previousButton = document.createElement('button');
        previousButton.classList.add('previous-button');
        previousButton.innerHTML = this.#getIconHTML(this.#iconsData.previousData);
        previousButton.addEventListener('click',() => {this.#previous();});

        const nextButton = document.createElement('button');
        nextButton.classList.add('next-button');
        nextButton.innerHTML = this.#getIconHTML(this.#iconsData.nextData);
        nextButton.addEventListener('click',() => {this.#next();});

        this.#imageCarouselDiv.appendChild(previousButton);
        this.#imageCarouselDiv.appendChild(nextButton);

        // add interface (previous and next buttons)
        this.#navigationDiv = document.createElement('div');
        this.#navigationDiv.classList.add('image-carousel-navigation');
        for (let i=0; i<this.#numOfImgs; i++){
            const slideDotButton = document.createElement('button');
            slideDotButton.classList.add('slide-dot-button');

            let iconDataPrefix;
            const iconDataIcon = this.#iconsData.navigationDotDataIcon;
            if (i===this.#currentImg)
                iconDataPrefix = this.#iconsData.navigationDotDataPrefixCurrent;
            else
                iconDataPrefix = this.#iconsData.navigationDotDataPrefix;
            slideDotButton.innerHTML = this.#getIconHTML(`${iconDataPrefix} ${iconDataIcon}`);

            slideDotButton.addEventListener('click',() => {this.#showSlide(i);});
            this.#navigationDiv.appendChild(slideDotButton);
        }

        this.#imageCarouselDiv.appendChild(this.#navigationDiv);

        parentDiv.appendChild(this.#imageCarouselDiv);
    }

    #getValidIdx(idx){
        let mod = (x,n) => ((x % n) + n) % n;
        return mod(idx, this.#numOfImgs);
    }

    #showSlide(idx=0){
        idx = this.#getValidIdx(idx);
        this.#unselectCurrentSlideIcon();
        this.#imagesDiv.style.left = `-${idx*100}%`;
        this.#currentImg = idx;
        this.#selectCurrentSlideIcon();
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