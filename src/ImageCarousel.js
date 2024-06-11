import './ImageCarousel.css';

export default class ImageCarousel{
    #imageCarouselDiv;
    #imgs = [];

    constructor(parentDiv,imagesPaths){
        this.#imageCarouselDiv = document.createElement('div');
        this.#imageCarouselDiv.classList.add('image-carousel');

        const imagesDiv = document.createElement('div');
        imagesDiv.classList.add('image-carousel-slides');
        imagesPaths.forEach(imgPath => {
            const img = document.createElement('img');
            img.setAttribute('src',imgPath);

            this.#imgs.push(img);
            imagesDiv.appendChild(img);
        })
        this.#imageCarouselDiv.appendChild(imagesDiv);
        
        parentDiv.appendChild(this.#imageCarouselDiv);
    }
}