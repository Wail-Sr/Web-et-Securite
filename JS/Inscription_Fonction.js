document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".auth-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const prenom = document.getElementById("prenom").value.trim();
        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        const telephone = document.getElementById("telephone").value.trim();
        const motdepasse = document.getElementById("motdepasse").value;

        if (!prenom || !nom || !email || !telephone || !motdepasse) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Envoyer les données au serveur Node.js
        try {
            let response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prenom, nom, email, telephone, motdepasse })
            });

            let data = await response.json();
            console.log("Réponse du serveur :", data);

            if (response.ok) {
                alert(`Inscription réussie ! Vous avez reçu un solde de ${data.solde}€.`);
                window.location.href = "Connexion.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert("Erreur serveur, réessayez plus tard.");
        }
    });
});
