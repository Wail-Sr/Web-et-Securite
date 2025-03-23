document.addEventListener("DOMContentLoaded", async () => {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      // if we are on the mes-reservations page, redirect to login page
      if (window.location.pathname === "/Mes-reservations.html") {
        window.location.href = "Connexion.html";
      }
    }

    const clientId = user?.user_metadata?.client_id;

    const reservations = await fetchReservations(clientId);

    const upcomingReservations = reservations.filter(
      (reservation) => new Date(reservation.date_debut) >= new Date()
    );
    const pastReservations = reservations.filter(
      (reservation) => new Date(reservation.date_fin) < new Date()
    );

    displayReservations(
      upcomingReservations,
      "upcoming-reservations-container"
    );
    displayReservations(pastReservations, "past-reservations-container");
  } catch (error) {
    console.error("Auth error:", error);
    loginLink.classList.remove("hidden");
  }
});

const fetchReservations = async (clientId) => {
  const { data: reservations, error } = await supabaseClient
    .from("reservations")
    .select(
      `
      *,
      maison:id_maison(
        *,
        statut_maison
        (status), 
        type_maison(nom),
        photos(type -> Exterieur,url)
      )
    `
    )
    .eq("id_client", clientId)
    .order("date_fin", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    return [];
  }

  return reservations;
};

const displayReservations = async (
  reservations,
  containerId = "reservations-container"
) => {
  const reservationsContainer = document.getElementById(containerId);
  reservationsContainer.innerHTML = "";

  if (reservations.length === 0) {
    const noReservations = document.createElement("p");
    noReservations.classList.add("no-reservations");
    noReservations.textContent = "Aucune réservation trouvée.";
    reservationsContainer.appendChild(noReservations);
    return;
  }

  reservations.forEach((reservation) => {
    const house = reservation.maison;
    console.log(reservation);

    // Maison box
    const reservationBox = document.createElement("div");
    reservationBox.classList.add("house-box");

    // Carousel
    const carousel = document.createElement("div");
    carousel.classList.add("carousel");

    // Images d'extérieur
    const images = house.photos
      ? house.photos.map((photo) => photo.url)
      : ["../Media/Immobilier/erreur_image.jpg"];

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

    // Informations

    const houseName = document.createElement("h3");
    houseName.classList.add("house-info");
    houseName.textContent = `${house.titre} (${house.ville}, ${house.pays})`;
    houseName.innerHTML = `
    ${house.titre}
    <span class="location">${house.ville}, ${house.pays}</span>
  `;

    const reservationDetails = document.createElement("div");
    reservationDetails.classList.add("house-info");
    reservationDetails.classList.add("reservation-details");

    // add hr to separate house name and reservation details
    const hr = document.createElement("hr");
    reservationDetails.appendChild(hr);

    const checkIn = document.createElement("p");
    checkIn.classList.add("reservation-info"); // Add a class for styling
    checkIn.innerHTML = `<i class="fas fa-door-open"></i> Arrivée: ${new Date(
      reservation.date_debut
    ).toLocaleDateString("fr-FR")}`; // Use French locale

    const checkOut = document.createElement("p");
    checkOut.classList.add("reservation-info"); // Add a class for styling
    checkOut.innerHTML = `<i class="fas fa-sign-out-alt"></i> Départ: ${new Date(
      reservation.date_fin
    ).toLocaleDateString("fr-FR")}`; // Use French locale

    // see details button
    const seeDetails = document.createElement("button");
    seeDetails.classList.add("see-more");
    seeDetails.textContent = "Voir les détails";
    seeDetails.addEventListener("click", () => {
      window.location.href = `Detail.html?houseId=${house.id}`;
    });

    reservationBox.appendChild(carousel);
    reservationBox.appendChild(houseName);
    reservationDetails.appendChild(checkIn);
    reservationDetails.appendChild(checkOut);
    reservationDetails.appendChild(seeDetails);

    reservationBox.appendChild(reservationDetails);
    reservationsContainer.appendChild(reservationBox);
  });
};
