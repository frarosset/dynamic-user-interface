import './ImageCarousel.css';

export default class ImageCarousel{
    #imageCarouselDiv;
    #imgs = [];
    #imagesDiv;

    constructor(parentDiv,imagesPaths){
        this.#imageCarouselDiv = document.createElement('div');
        this.#imageCarouselDiv.classList.add('image-carousel');

        const frameDiv = document.createElement('div');
        frameDiv.classList.add('image-carousel-frame');
        
        this.#imagesDiv = document.createElement('div');
        this.#imagesDiv.classList.add('image-carousel-slides');
        imagesPaths.forEach(imgPath => {
            const img = document.createElement('img');
            img.setAttribute('src',imgPath);

            this.#imgs.push(img);
            this.#imagesDiv.appendChild(img);
        });

        frameDiv.appendChild(this.#imagesDiv);
        this.#imageCarouselDiv.appendChild(frameDiv);

        console.log(this.#imgs);
        this.#showSlide(1);

        parentDiv.appendChild(this.#imageCarouselDiv);
    }

    #showSlide(idx=0){
        this.#imagesDiv.style.left = `-${idx*100}%`;
    }
}