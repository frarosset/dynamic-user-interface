import './ImageCarousel.css';

export default class ImageCarousel{
    #imageCarouselDiv;

    constructor(parentDiv,imagesPaths){
        this.#imageCarouselDiv = document.createElement('div');
        this.#imageCarouselDiv.classList.add('image-carousel');

        this.#imageCarouselDiv.textContent = 'IMAGE CAROUSEL for: ' + imagesPaths; 
        
        parentDiv.appendChild(this.#imageCarouselDiv);
    }
}