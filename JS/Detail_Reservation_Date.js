document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const houseId = params.get('houseId');
    if (!houseId) {
        console.error("Aucun houseId fourni dans l'URL.");
        return;
    }

    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    fetch('Data_Base/Reservation.json')
        .then(response => response.json())
        .then(data => {
            const reservations = data.reservations.filter(res => res.idImmobilier === houseId);
            let reservedDates = [];

            reservations.forEach(res => {
                let currentDate = new Date(res.dateDebut);
                const endDate = new Date(res.dateFin);

                while (currentDate <= endDate) {
                    reservedDates.push(currentDate.toISOString().split('T')[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            });

            // Configuration du calendrier avec Flatpickr
            function setupFlatpickr(input) {
                flatpickr(input, {
                    dateFormat: "Y-m-d",
                    disable: reservedDates.map(date => ({ from: date, to: date })),
                    locale: {
                        firstDayOfWeek: 1 // Commence la semaine le lundi
                    }
                });
            }

            setupFlatpickr(checkinInput);
            setupFlatpickr(checkoutInput);
        })
        .catch(err => console.error("Erreur lors du chargement des réservations :", err));
});
