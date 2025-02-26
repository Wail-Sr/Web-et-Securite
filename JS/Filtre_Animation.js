document.addEventListener("DOMContentLoaded", () => {
    const prixRange = document.getElementById("prix");
    const prixValeur = document.getElementById("prix-valeur");
    const surfaceRange = document.getElementById("surface");
    const surfaceValeur = document.getElementById("surface-valeur");
    const capaciteButtons = document.querySelectorAll(".capacite-btn");
    const capaciteInput = document.getElementById("capacite");

    // Mise à jour de l'affichage du prix
    prixRange.addEventListener("input", () => {
        prixValeur.textContent = prixRange.value;
    });

    // Mise à jour de l'affichage de la surface
    surfaceRange.addEventListener("input", () => {
        surfaceValeur.textContent = surfaceRange.value;
    });

    // Gestion des boutons de capacité (activer/désactiver)
    capaciteButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("active")) {
                button.classList.remove("active");
                capaciteInput.value = "";
            } else {
                capaciteButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                capaciteInput.value = button.dataset.value;
            }
        });
    });
});
