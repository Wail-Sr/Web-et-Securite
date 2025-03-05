document.addEventListener("DOMContentLoaded", function () {
    const userBox = document.getElementById("user-box");
    const loginLink = document.getElementById("login-link");
    const userName = document.getElementById("user-name");
    const userSolde = document.getElementById("user-solde");
    const logoutButton = document.getElementById("logout-button");
    const dropdownMenu = document.getElementById("dropdown-menu");

    // Vérifier si un utilisateur est connecté
    const user = JSON.parse(sessionStorage.getItem("connectedUser"));

    if (user) {
        loginLink.style.display = "none"; 
        userBox.style.display = "flex";
        userName.textContent = `${user.prenom} ${user.nom}`;
        userSolde.textContent = `Solde = ${user.solde}€`;

        // Afficher/masquer le menu déroulant au clic
        userBox.addEventListener("click", function () {
            dropdownMenu.classList.toggle("hidden");
        });

        // Déconnexion
        logoutButton.addEventListener("click", function () {
            sessionStorage.removeItem("connectedUser");
            alert("Vous êtes déconnecté.");
            window.location.href = "Connexion.html";
        });

    } else {
        loginLink.style.display = "block";
        userBox.style.display = "none";
    }
});
