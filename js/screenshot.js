function initScreenshot() {
    const imageContainer = document.querySelector(".splide__list");
    const screenshots = [
        "screenshot1.webp", "screenshot2.webp", "screenshot3.webp",
        "screenshot4.webp", "screenshot5.webp", "screenshot6.webp",
        "screenshot7.webp", "screenshot8.webp", "screenshot9.webp",
        "screenshot10.webp", "screenshot11.webp"
    ];
    screenshots.forEach((image) => {
        const li = document.createElement("li");
        li.classList.add("splide__slide");
        li.innerHTML = `<img src="img/${image}" alt="Screenshot" />`;
        imageContainer.appendChild(li);
    });
    new Splide("#image-carousel").mount();
}
