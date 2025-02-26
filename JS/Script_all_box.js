document.addEventListener("DOMContentLoaded", () => {
  fetch('Data_Base/Immobilier.json')
    .then(response => response.json())
    .then(data => {
      const maisons = data.Maisons;
      const resultsContainer = document.querySelector("main.results");

      maisons.forEach(house => {
        // Conteneur principal
        const houseBox = document.createElement("div");
        houseBox.classList.add("house-box");

        // Carousel
        const carousel = document.createElement("div");
        carousel.classList.add("carousel");

        // Images d'extérieur
        const images = (Array.isArray(house.Exterieur) && house.Exterieur.length > 0)
          ? house.Exterieur
          : ["erreur_image.jpg"];

        // Image unique + index
        const carouselImage = document.createElement("img");
        carouselImage.classList.add("carousel-image");
        carousel.appendChild(carouselImage);

        let currentIndex = 0;
        function updateImage() {
          carouselImage.src = `Media/Immobilier/${images[currentIndex]}`;
          carouselImage.alt = `Maison ${house.id} - image extérieure ${currentIndex + 1}`;
        }
        carouselImage.onerror = () => {
          carouselImage.src = `Media/Immobilier/erreur_image.jpg`;
        };
        updateImage();

        // Boutons du carousel s'il y a plusieurs images
        if (images.length > 1) {
          const prevBtn = document.createElement("button");
          prevBtn.classList.add("prev-btn");
          prevBtn.textContent = "<";
          const nextBtn = document.createElement("button");
          nextBtn.classList.add("next-btn");
          nextBtn.textContent = ">";

          prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateImage();
          });
          nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateImage();
          });

          carousel.appendChild(prevBtn);
          carousel.appendChild(nextBtn);
        }

        houseBox.appendChild(carousel);

        // Informations
        const titre = document.createElement("h3");
        titre.textContent = house.description;
        houseBox.appendChild(titre);

        const details = document.createElement("p");
        details.textContent = `${house.chambres} chambres • ${house.superficie} • Vue ${house.destination} • ${house.pays}`;
        houseBox.appendChild(details);

        const price = document.createElement("p");
        price.classList.add("price");
        price.textContent = `${house.prix_par_nuit}€/nuit`;
        houseBox.appendChild(price);

        // Bouton "Voir plus"
        const seeMore = document.createElement("button");
        seeMore.classList.add("see-more");
        seeMore.textContent = "Voir plus";
        seeMore.addEventListener("click", () => {
          // Redirection vers detail.html, en passant l'ID
          window.location.href = `detail.html?houseId=${house.id}`;
        });
        houseBox.appendChild(seeMore);

        // On ajoute la box dans la page
        resultsContainer.appendChild(houseBox);
      });
    })
});
