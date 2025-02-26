document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".auth-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupération des valeurs du formulaire
        const prenom = document.getElementById("prenom").value.trim();
        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        const telephone = document.getElementById("telephone").value.trim();
        const motdepasse = document.getElementById("motdepasse").value;

        // Vérification des champs obligatoires
        if (!prenom || !nom || !email || !telephone || !motdepasse) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // Récupérer les utilisateurs existants depuis localStorage (simule Client.json)
        let clients = JSON.parse(localStorage.getItem("Clients")) || [];

        // Vérifier si l'utilisateur existe déjà via l'email
        if (clients.some(client => client.email === email)) {
            alert("Cet email est déjà utilisé.");
            return;
        }

        // Hasher le mot de passe avec SHA-256
        const hashedPassword = await hashPassword(motdepasse);

        // Créer un nouvel utilisateur
        const newUser = {
            id: String(clients.length + 1),
            nom,
            prenom,
            email,
            telephone,
            motdepasse: hashedPassword // On stocke uniquement le hash
        };

        // Ajouter le nouvel utilisateur à la base (localStorage)
        clients.push(newUser);
        localStorage.setItem("Clients", JSON.stringify(clients));

        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        window.location.href = "Connexion.html"; // Redirection vers la page de connexion
    });

    // Fonction pour hasher un mot de passe avec SHA-256
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }
});
