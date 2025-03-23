import { handleAllowedReservation } from "./Detail_Reservation_Date.js";
import { calculateDaysBetweenDates } from "./helpers.js";

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
          )),
        reservations(
          id,
          date_debut,
          date_fin,
          statut:statut_reservation(
            nom
          )
        )
    `
    )
    .eq("id", houseId)
    .gte("reservations.date_fin", new Date().toISOString())
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la maison :", error);
    return;
  }

  // Sélection des éléments HTML
  const titleEl = document.getElementById("house-title");
  const locationEl = document.getElementById("house-location");
  const priceEl = document.getElementById("price-value");
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
  displayImages(allImages);
  diplayAdvantages(maison.avantages_maisons);
  handleAllowedReservation(maison.reservations, maison.prix_par_nuit);

  // Gérer le bouton "Réserver"
  handleReservation(maison, maison.prix_par_nuit);
});

const displayImages = (allImages) => {
  const mainImage = document.getElementById("main-image");
  const thumbnailsContainer = document.getElementById("thumbnails");

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
};

const diplayAdvantages = (advantages) => {
  // Injection des avantages dans la liste
  const advantagesList = document.getElementById("advantages-list");
  advantagesList.innerHTML = ""; // Nettoyer la liste existante

  if (advantages && advantages.length > 0) {
    console.log("Avantages disponibles :", advantages);
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
};

const handleReservation = async (maison) => {
  const reserveBtn = document.getElementById("reserve-btn");
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  if (reserveBtn) {
    reserveBtn.addEventListener("click", async () => {
      const startDate = checkinInput.value;
      const endDate = checkoutInput.value;

      if (!startDate || !endDate) {
        alert("Veuillez sélectionner des dates valides.");
        return;
      }

      // disable button
      reserveBtn.disabled = true;

      // Get the current user solde using the user id from the session
      const {
        data: {
          user: {
            user_metadata: { client_id },
          },
        },
      } = await supabaseClient.auth.getUser();
      let userSolde = 0;

      if (client_id) {
        const { data: client, error } = await supabaseClient
          .from("client")
          .select("solde")
          .eq("id", client_id)
          .single();

        if (error) {
          console.error(
            "Erreur lors de la récupération du solde du client :",
            error
          );
        }

        if (client) {
          userSolde = client.solde;
        }
      }

      const numberOfDays = calculateDaysBetweenDates(startDate, endDate);
      const paymentAmount = maison.prix_par_nuit * numberOfDays;

      if (!userSolde || userSolde < paymentAmount) {
        handleNoSufficientSolde();
        reserveBtn.disabled = false;
        return;
      }

      const newSolde = userSolde - paymentAmount;

      await makeReservation(maison.id, client_id, newSolde, startDate, endDate);

      // enable button
      reserveBtn.disabled = false;
    });
  }
};

const makeReservation = async (
  maison_id,
  client_id,
  newSolde,
  startDate,
  endDate
) => {
  // do the reservation and update the user solde
  try {
    const { data, error } = await supabaseClient.from("reservations").insert([
      {
        id_maison: maison_id,
        id_client: client_id,
        date_debut: startDate,
        date_fin: endDate,
      },
    ]);

    if (error) {
      console.error("Erreur lors de la réservation :", error);
      return;
    }

    const { error: updateError } = await supabaseClient
      .from("client")
      .update({ solde: newSolde })
      .eq("id", client_id);

    if (updateError) {
      console.error("Erreur lors de la mise à jour du solde :", updateError);
      return;
    }

    // move to the user reservations page
    // window.location.href = "/Mes-reservations.html";
    alert("Réservation effectuée avec succès !", newSolde);
  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
    return;
  }
};

const handleNoSufficientSolde = () => {
  // get the model
  const modal = document.getElementById("no-solde-modal");
  const closeBtn = document.getElementById("close-modal");
  const topUpBtn = document.getElementById("top-up");

  // More robust scroll locking
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  
  // show the modal
  modal.style.display = "flex";
  
  // Function to restore scrolling
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
  };

  // show the modal
  modal.style.display = "flex";

  // Close the modal when the user clicks on the close button
  closeBtn.onclick = () => {
    modal.style.display = "none";
    unlockScroll();
  };

  // Close the modal when the user clicks outside of it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      unlockScroll();
    }
  };

  // redirect to the top up page
  topUpBtn.onclick = () => {
    window.location.href = "/AjouterArgent.html";
  };
};
