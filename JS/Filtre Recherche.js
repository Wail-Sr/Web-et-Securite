document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel");
    const prixRange = document.getElementById("prix");
    const prixValeur = document.getElementById("prix-valeur");
    const surfaceRange = document.getElementById("surface");
    const surfaceValeur = document.getElementById("surface-valeur");
    const capaciteButtons = document.querySelectorAll(".capacite-btn");
    const capaciteInput = document.getElementById("capacite");


    // ----------- Partie Filtre Animation -----------------


    // Met à jour la valeur affichée du prix max
    prixRange.addEventListener("input", () => {
        prixValeur.textContent = prixRange.value;
    });

    // Met à jour la valeur affichée de la surface
    surfaceRange.addEventListener("input", () => {
        surfaceValeur.textContent = surfaceRange.value;
    });

    // Gestion des boutons de capacité avec changement de couleur
    capaciteButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Réinitialiser tous les boutons
            capaciteButtons.forEach(btn => btn.classList.remove("active"));

            // Ajouter la classe active uniquement au bouton cliqué
            button.classList.add("active");
            capaciteInput.value = button.dataset.value;
        });
    });


    // ----------- Partie pour le carousel -----------------

    
    carousels.forEach(carousel => {
        let index = 0;
        const images = carousel.querySelectorAll("img");
        const prevBtn = carousel.querySelector(".prev-btn");
        const nextBtn = carousel.querySelector(".next-btn");
        let interval;

        // Fonction pour changer d'image
        function showImage(newIndex) {
            images[index].classList.remove("active");
            index = (newIndex + images.length) % images.length; // Gestion des limites
            images[index].classList.add("active");
        }

        // Changement auto au survol
        function startCarousel() {
            interval = setInterval(() => {
                showImage(index + 1);
            }, 3000);
        }

        // Arrêt du carrousel quand la souris quitte la box
        function stopCarousel() {
            clearInterval(interval);
        }

        // Écouteurs d'événements
        prevBtn.addEventListener("click", () => showImage(index - 1));
        nextBtn.addEventListener("click", () => showImage(index + 1));

        carousel.addEventListener("mouseenter", startCarousel);
        carousel.addEventListener("mouseleave", stopCarousel);

        // Initialisation : première image active
        images[index].classList.add("active");
    });
})