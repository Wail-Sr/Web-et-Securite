import { fetchMaisons, filerMaisons } from "./Fetch_Maisons.js";

document.addEventListener("DOMContentLoaded", async () => {
  let page = 1;
  let isFiltering = false;
  let maisons;

  const searchForm = document.getElementById("search-form");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageDisplay = document.getElementById("page-number");
  const resetBtn = document.getElementById("reset-filter");

  maisons = await fetchMaisons(page);
  displayHouses(maisons);

  // Filter maisons based on the user's search criteria
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    isFiltering = true;
    resetBtn.disabled = false;
    page = 1;
    maisons = await filerHouses(page);
    displayHouses(maisons);
    pageDisplay.textContent = `Page ${page}`;
    prevBtn.disabled = true;

    if (maisons.length < 10) {
      nextBtn.disabled = true;
    }
  });

  prevBtn.addEventListener("click", async () => {
    if (page > 1) {
      page--;
      if (page === 1) {
        prevBtn.disabled = true;
      }
      maisons = isFiltering
        ? await filerMaisons(page)
        : await fetchMaisons(page);
      displayHouses(maisons);
      pageDisplay.textContent = `Page ${page}`;
    }
  });

  nextBtn.addEventListener("click", async () => {
    page++;
    maisons = isFiltering ? await filerMaisons(page) : await fetchMaisons(page);
    displayHouses(maisons);

    if (maisons.length < 10) {
      nextBtn.disabled = true;
    }

    if (page > 1) {
      prevBtn.disabled = false;
    }

    pageDisplay.textContent = `Page ${page}`;
  });

  resetBtn.addEventListener("click", async () => {
    isFiltering = false;
    resetBtn.disabled = true;
    page = 1;
    maisons = await fetchMaisons(page);
    displayHouses(maisons);
    pageDisplay.textContent = `Page ${page}`;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
  });

  // Initial display
  pageDisplay.textContent = `Page ${page}`;
});

const displayHouses = (maisons) => {
  const resultsContainer = document.querySelector("main.results");
  resultsContainer.innerHTML = "";

  maisons.forEach((house) => {
    // Conteneur principal
    const houseBox = document.createElement("div");
    houseBox.classList.add("house-box");

    // Carousel
    const carousel = document.createElement("div");
    carousel.classList.add("carousel");

    // Images d'extérieur
    const images = house.photos
      ? house.photos.map((photo) => photo.url)
      : ["erreur_image.jpg"];

    // Image unique + index
    const carouselImage = document.createElement("img");
    carouselImage.classList.add("carousel-image");
    carousel.appendChild(carouselImage);

    let currentIndex = 0;
    function updateImage() {
      carouselImage.src = images[currentIndex];
      carouselImage.alt = `Maison ${house.id} - image extérieure ${
        currentIndex + 1
      }`;
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
        currentIndex =
          currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateImage();
      });
      nextBtn.addEventListener("click", () => {
        currentIndex =
          currentIndex === images.length - 1 ? 0 : currentIndex + 1;
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
    details.textContent = `${house.chambres} chambres • ${house.superficie} m² • Vue ${house.type_maison.nom} • ${house.pays}`;
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
      redirectToDetailsPage(house.id);
    });
    houseBox.appendChild(seeMore);

    // On ajoute la box dans la page
    resultsContainer.appendChild(houseBox);
  });
};

const filerHouses = async (page) => {
  const lieuValue = document.getElementById("lieu").value;
  const villeValue = document.getElementById("ville").value;
  const paysValue = document.getElementById("pays").value;
  const prixMax = parseFloat(document.getElementById("prix").value);
  const capaciteValue = document.getElementById("capacite").value;
  const surfaceMin = parseFloat(document.getElementById("surface").value);

  return await filerMaisons(
    lieuValue,
    villeValue,
    paysValue,
    prixMax,
    capaciteValue,
    surfaceMin,
    page
  );
};

const redirectToDetailsPage = async (houseId) => {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      document.getElementById("auth-modal").style.display = "flex";
      // disable scrolling
      document.body.style.overflow = "hidden";

      // Close the modal when the user clicks outside of it
      window.onclick = function (event) {
        const modal = document.getElementById("auth-modal");
        if (event.target === modal) {
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }
      };
      

    } else {
      window.location.href = `Detail.html?houseId=${houseId}`;
    }
  } catch (error) {
    console.error("Auth error:", error);
    loginLink.classList.remove("hidden");
  }
};
