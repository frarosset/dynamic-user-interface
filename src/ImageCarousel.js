import './ImageCarousel.css';

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

        this.#showSlide(1);

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
}