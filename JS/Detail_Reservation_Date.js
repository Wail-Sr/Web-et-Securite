import { calculateDaysBetweenDates } from "./helpers.js";

export const handleAllowedReservation = (existingReservations, price) => {
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const paymentAmount = document.getElementById("payment-amount");

  const reservedCheckinDates = existingReservations.reduce((acc, res) => {
    let currentDate = new Date(res.date_debut);
    const endDate = new Date(res.date_fin);

    while (currentDate < endDate) {
      acc.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return acc;
  }, []);

  const reservedCheckoutDates = existingReservations.reduce((acc, res) => {
    let currentDate = new Date(res.date_debut);
    currentDate.setDate(currentDate.getDate() + 1); // La date de fin doit être au moins le lendemain de la date de début
    const endDate = new Date(res.date_fin);

    while (currentDate < endDate) {
      acc.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return acc;
  }, []);

  const checkoutCalendar = flatpickr(checkoutInput, {
    dateFormat: "Y-m-d",
    disable: reservedCheckoutDates.map((date) => ({ from: date, to: date })),
    minDate: new Date().fp_incr(1), // Par défaut, au moins le lendemain
    locale: {
      firstDayOfWeek: 1,
    },
    onChange: (selectedDates) => {
      if (selectedDates.length > 0) {
        const numberOfDays = calculateDaysBetweenDates(
          checkinInput.value,
          selectedDates[0]
        );
        paymentAmount.textContent = numberOfDays * price || 0;
      } else {
        paymentAmount.textContent = 0;
      }
    },
  });

  // Configuration du calendrier Flatpickr
  flatpickr(checkinInput, {
    dateFormat: "Y-m-d",
    disable: reservedCheckinDates.map((date) => ({ from: date, to: date })),
    minDate: new Date(), // Date minimum : lendemain de la date actuelle
    locale: {
      firstDayOfWeek: 1, // Lundi comme premier jour
    },
    onChange: (selectedDates) => {
      if (selectedDates.length > 0) {
        const minCheckoutDate = new Date(selectedDates[0]);
        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1); // La date de fin doit être au moins le lendemain
        const maxCheckoutDate = new Date(
          Math.min(
            ...reservedCheckinDates
              .map((date) => new Date(date))
              .filter((date) => date > minCheckoutDate)
          )
        ); // la date de fin doit être au plus moins de la plus proche réservation

        checkoutCalendar.set("maxDate", maxCheckoutDate);
        checkoutCalendar.set("minDate", minCheckoutDate);

        // Optionnel : Réinitialiser la date de départ si elle est avant la nouvelle minDate
        if (
          checkoutInput.value &&
          new Date(checkoutInput.value) <= minCheckoutDate
        ) {
          checkoutInput.value = "";
        }
      }
      if (selectedDates.length > 1) {
        const numberOfDays = calculateDaysBetweenDates(
          selectedDates[0],
          checkoutInput.value
        );
        paymentAmount.textContent = numberOfDays * price || 0;
      } else {
        paymentAmount.textContent = 0;
      }
    },
  });
};
