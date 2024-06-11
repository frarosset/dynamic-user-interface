import './ImageCarousel.css';

export default class ImageCarousel{
    #imageCarouselDiv;
    #imgs = [];

    constructor(parentDiv,imagesPaths){
        this.#imageCarouselDiv = document.createElement('div');
        this.#imageCarouselDiv.classList.add('image-carousel');

        const frameDiv = document.createElement('div');
        frameDiv.classList.add('image-carousel-frame');
        
        const imagesDiv = document.createElement('div');
        imagesDiv.classList.add('image-carousel-slides');
        imagesPaths.forEach(imgPath => {
            const img = document.createElement('img');
            img.setAttribute('src',imgPath);

            this.#imgs.push(img);
            imagesDiv.appendChild(img);
        });

        frameDiv.appendChild(imagesDiv);
        this.#imageCarouselDiv.appendChild(frameDiv);

        console.log(this.#imgs);
        
        parentDiv.appendChild(this.#imageCarouselDiv);
    }
}