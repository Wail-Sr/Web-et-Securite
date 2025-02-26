document.addEventListener("DOMContentLoaded", function () {
    const userBox = document.getElementById("user-box");
    const loginLink = document.getElementById("login-link");
    const userName = document.getElementById("user-name");
    const userSolde = document.getElementById("user-solde");
    const logoutButton = document.getElementById("logout-button");

    // Vérifier si un utilisateur est connecté
    const user = JSON.parse(sessionStorage.getItem("connectedUser"));

    if (user) {
        // MASQUER le bouton Connexion
        loginLink.style.display = "none";

        // AFFICHER la box utilisateur
        userBox.style.display = "flex";

        // Afficher le nom et prénom de l'utilisateur connecté
        userName.textContent = `${user.prenom} ${user.nom}`;

        // Récupérer le solde de l'utilisateur (simulé ici, peut être stocké dans localStorage)
        let solde = user.solde || Math.floor(Math.random() * 500) + 50; // Simule un solde entre 50€ et 500€
        userSolde.textContent = `Solde = ${solde}€`;

        // Stocker le solde dans l'utilisateur pour la session (optionnel)
        user.solde = solde;
        sessionStorage.setItem("connectedUser", JSON.stringify(user));

    } else {
        // Si l'utilisateur n'est pas connecté, afficher Connexion et cacher la box utilisateur
        loginLink.style.display = "block";
        userBox.style.display = "none";
    }

    // Gestion du bouton Déconnexion
    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("connectedUser");
        alert("Vous êtes déconnecté.");
        window.location.href = "Connexion.html"; // Redirection vers la page de connexion
    });
});