document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const houseId = params.get("houseId");

  if (!houseId) {
    console.error("Aucun houseId n'a été fourni dans l'URL.");
    return;
  }

  const { data: maison, error } = await supabaseClient
    .from("maisons")
    .select(
      `
        *,
        photos(url),
        avantages_maisons(
          avantages(
            label
          ))
    `
    )
    .eq("id", houseId)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la maison :", error);
    return;
  }

  // Sélection des éléments HTML
  const titleEl = document.getElementById("house-title");
  const locationEl = document.getElementById("house-location");
  const priceEl = document.getElementById("price-value");
  const mainImage = document.getElementById("main-image");
  const thumbnailsContainer = document.getElementById("thumbnails");
  const titleEL2 = document.getElementById("property-title");
  const descriptionEl = document.getElementById("property-description");

  // Remplir le titre, la localisation et le prix
  titleEl.textContent = maison.titre;
  locationEl.textContent = maison.ville + ", " + maison.pays;
  priceEl.textContent = maison.prix_par_nuit;
  descriptionEl.textContent =
    maison.description || "Description non disponible";

  // Fonction pour obtenir une image valide à partir d'un tableau donné
  function getValidImages(imagesArray) {
    return Array.isArray(imagesArray) && imagesArray.length > 0
      ? imagesArray.map((img) => img.url)
      : ["erreur_image.jpg"];
  }

  const allImages = getValidImages(maison.photos);

  // Gestion de l'image principale
  let mainImageSrc = allImages[0];
  mainImage.src = mainImageSrc;
  mainImage.style.height = "400px";
  mainImage.style.objectFit = "cover";
  mainImage.style.width = "100%";
  mainImage.style.borderRadius = "8px";
  mainImage.onerror = () => {
    mainImage.src = "Media/Immobilier/erreur_image.jpg";
  };

  // Si le conteneur des vignettes existe :
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = ""; // Nettoyer les vignettes existantes

    // Créer une structure avec flèches et conteneur
    const upArrow = document.createElement("button");
    upArrow.classList.add("arrow", "up-arrow");
    upArrow.innerHTML = "▲";

    const thumbnailsWrapper = document.createElement("div");
    thumbnailsWrapper.classList.add("thumbnails-wrapper");

    const downArrow = document.createElement("button");
    downArrow.classList.add("arrow", "down-arrow");
    downArrow.innerHTML = "▼";

    // Insérer dans le conteneur
    thumbnailsContainer.appendChild(upArrow);
    thumbnailsContainer.appendChild(thumbnailsWrapper);
    thumbnailsContainer.appendChild(downArrow);

    // Générer les vignettes
    allImages.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.alt = `Thumbnail ${index + 1}`;
      thumb.classList.add("thumbnail");

      // Gérer l'erreur éventuelle sur la vignette
      thumb.onerror = () => {
        thumb.src = "Media/Immobilier/erreur_image.jpg";
      };

      // Ajout de l'événement de changement d'image principale
      thumb.addEventListener("click", () => {
        mainImage.src = img;
        document
          .querySelectorAll(".thumbnail")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });

      thumbnailsWrapper.appendChild(thumb);

      // Définir la première vignette comme active
      if (index === 0) {
        thumb.classList.add("active");
      }
    });

    // Gestion des flèches de défilement
    const scrollAmount = 100; // Nombre de pixels à faire défiler
    upArrow.addEventListener("click", () => {
      thumbnailsWrapper.scrollBy({
        top: -scrollAmount,
        behavior: "smooth",
      });
    });

    downArrow.addEventListener("click", () => {
      thumbnailsWrapper.scrollBy({ top: scrollAmount, behavior: "smooth" });
    });
  }

  // Gérer le bouton "Réserver"
  const reserveBtn = document.getElementById("reserve-btn");
  if (reserveBtn) {
    reserveBtn.addEventListener("click", () => {
      window.location.href = "Reservation.html";
    });
  }

  // Injection des avantages dans la liste
  const advantagesList = document.getElementById("advantages-list");
  advantagesList.innerHTML = ""; // Nettoyer la liste existante

  if (maison.avantages_maisons && maison.avantages_maisons.length > 0) {
    console.log("Avantages disponibles :", maison.avantages_maisons);
    const advantages = maison.avantages_maisons;
    advantages.forEach(({ avantages }) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>+</span> ${avantages.label}`;
      advantagesList.appendChild(listItem);
    });
  } else {
    console.log("Aucun avantage disponible");
    advantagesList.innerHTML = "<li>Aucun avantage disponible</li>";
  }

  // Gestion du bouton "Lire la suite"
  const readMoreLink = document.getElementById("read-more");
  readMoreLink.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Affichage du texte complet !");
  });
});
