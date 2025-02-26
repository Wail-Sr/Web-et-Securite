document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const bandeau = document.querySelector(".Bandeau-Carrousel");

    const images = [
        "Media/Illustration/Desert_illustration1.jpg",
        "Media/Illustration/Foret_illustration1.jpg",
        "Media/Illustration/Jungle_illustration1.jpg",
        "Media/Illustration/Mer_illustration1.jpg",
        "Media/Illustration/Montagne_illustration1.jpg"
    ];

    let index = 0;

    // Appliquer le premier fond dès le chargement
    bandeau.style.backgroundImage = `url(${images[0]})`;

    // Préchargement des images pour éviter le clignotement
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    function updateCarousel() {
        const firstItem = carousel.firstElementChild;
        index = (index + 1) % images.length;

        // Changer l'image de fond en douceur
        bandeau.style.transition = "background-image 1s ease-in-out";
        bandeau.style.backgroundImage = `url(${images[index]})`;

        // Animation fluide du carrousel
        carousel.style.transition = "transform 1.2s ease-out";
        carousel.style.transform = "translateX(-35%)";

        setTimeout(() => {
            carousel.style.transition = "none";
            carousel.appendChild(firstItem); // Déplace le premier élément à la fin
            carousel.style.transform = "translateX(0)"; // Réinitialisation
        }, 1200);
    }

    setInterval(updateCarousel, 3500);
});
