document.addEventListener("DOMContentLoaded", () => {
    const prixRange = document.getElementById("prix");
    const surfaceRange = document.getElementById("surface");
    const capaciteInput = document.getElementById("capacite");
    const resultsContainer = document.querySelector("main.results");
    const searchForm = document.getElementById("search-form");

    //Charger les données JSON
    fetch('Data_Base/Immobilier.json')
        .then(response => response.json())
        .then(data => {
            const maisons = data.Maisons;

            // 2) Fonction d'affichage des maisons
            function displayHouses(houses) {
                resultsContainer.innerHTML = "";
                houses.forEach(house => {
                    // -- Conteneur principal --
                    const houseBox = document.createElement("div");
                    houseBox.classList.add("house-box");

                    // -- Carousel --
                    const carousel = document.createElement("div");
                    carousel.classList.add("carousel");

                    // Images d'extérieur ou image d'erreur
                    const images = (Array.isArray(house.Exterieur) && house.Exterieur.length > 0)
                        ? house.Exterieur
                        : ["erreur_image.jpg"];

                    // Élément <img> unique
                    const carouselImage = document.createElement("img");
                    carouselImage.classList.add("carousel-image");
                    carousel.appendChild(carouselImage);

                    let currentIndex = 0;
                    function updateImage() {
                        carouselImage.src = `Media/Immobilier/${images[currentIndex]}`;
                        carouselImage.alt = `Maison ${house.id} - image extérieure ${currentIndex + 1}`;
                    }

                    // Gestion d'erreur image
                    carouselImage.onerror = () => {
                        carouselImage.src = `Media/Immobilier/erreur_image.jpg`;
                    };
                    updateImage();

                    // Si plusieurs images
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

                    // -- Infos de la maison --
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
                        // Redirection vers la page detail.html en passant l'ID de la maison
                        window.location.href = `detail.html?houseId=${house.id}`;

                    });

                    houseBox.appendChild(seeMore);

                    resultsContainer.appendChild(houseBox);
                });
            }

            //filtrage du formulaire
            searchForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const lieuValue = document.getElementById("lieu").value.toLowerCase();
                const villeValue = document.getElementById("ville").value.toLowerCase();
                const prixMax = parseFloat(prixRange.value);
                const capaciteValue = capaciteInput.value;
                const surfaceMin = parseFloat(surfaceRange.value);

                // Filtrage
                const filteredHouses = maisons.filter(house => {
                    // Lieu / destination
                    if (lieuValue && house.destination.toLowerCase() !== lieuValue) {
                        return false;
                    }
                    // Ville + Pays
                    if (villeValue) {
                        const combined = (house.ville + ", " + house.pays).toLowerCase();
                        if (!combined.includes(villeValue)) {
                            return false;
                        }
                    }
                    // Prix max
                    if (parseFloat(house.prix_par_nuit) > prixMax) {
                        return false;
                    }
                    // Capacité
                    if (capaciteValue) {
                        const houseCapacity = parseInt(house.capacite);
                        const filterCapacity = parseInt(capaciteValue);
                        // Si "8+", on accepte 8 ou plus
                        if (capaciteValue === "8") {
                            if (houseCapacity < 8) return false;
                        } else {
                            if (houseCapacity !== filterCapacity) return false;
                        }
                    }
                    // Surface min
                    const surfaceNumber = parseFloat(house.superficie);
                    if (surfaceNumber < surfaceMin) {
                        return false;
                    }
                    return true;
                });

                displayHouses(filteredHouses);
            });
        })
});
