document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".auth-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Empêche la page de se recharger

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Vérification des champs vides
        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Récupérer la liste des clients enregistrés
        let clients = JSON.parse(localStorage.getItem("Clients")) || [];

        // Vérifier si l'utilisateur existe
        const user = clients.find(client => client.email === email);
        if (!user) {
            alert("Email incorrect ou non enregistré.");
            return;
        }

        // Hasher le mot de passe saisi et le comparer avec celui enregistré
        const hashedPassword = await hashPassword(password);
        if (user.motdepasse !== hashedPassword) {
            alert("Mot de passe incorrect.");
            return;
        }

        // Stocker l'utilisateur connecté dans la session
        sessionStorage.setItem("connectedUser", JSON.stringify(user));

        alert(`Bienvenue, ${user.prenom} ! Connexion réussie.`);
        window.location.href = "index.html";
    });

    // Fonction pour hasher un mot de passe en SHA-256
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }
});