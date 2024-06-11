import './ImageCarousel.css';
// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';

export default class ImageCarousel{
    #imageCarouselDiv;
    #imagesDiv;
    #numOfImgs;
    #currentImg=0;

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

        // add interface
        let previousButton = document.createElement('button');
        previousButton.classList.add('previous-button');
        previousButton.innerHTML = this.#getIconHTML('fa-solid fa-chevron-left');
        previousButton.addEventListener('click',() => {this.#previous();});

        let nextButton = document.createElement('button');
        nextButton.classList.add('next-button');
        nextButton.textContent = 'next';
        nextButton.innerHTML = this.#getIconHTML('fa-solid fa-chevron-right');
        nextButton.addEventListener('click',() => {this.#next();});

        this.#imageCarouselDiv.appendChild(previousButton);
        this.#imageCarouselDiv.appendChild(nextButton);

        parentDiv.appendChild(this.#imageCarouselDiv);
    }

    #getValidIdx(idx){
        let mod = (x,n) => ((x % n) + n) % n;
        return mod(idx, this.#numOfImgs);
    }

    #showSlide(idx=0){
        idx = this.#getValidIdx(idx);
        this.#imagesDiv.style.left = `-${idx*100}%`;
        this.#currentImg = idx;
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
}