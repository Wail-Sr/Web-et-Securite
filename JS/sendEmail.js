document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Empêcher le rechargement de la page

        // Récupérer les données du formulaire
        const name = document.getElementById("nom").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("telephone").value;
        const message = document.getElementById("message").value;

        // Envoyer les données via EmailJS
        emailjs.send("service_im0plvo", "template_ay43p63", {
            from_name: name,
            from_email: email,
            phone: phone,
            message: message,
        })
        .then(function (response) {
            console.log("SUCCESS!", response.status, response.text);
            document.getElementById("success-message").style.display = "block"; // Afficher un message de succès
            document.getElementById("contact-form").reset(); // Réinitialiser le formulaire
        })
        .catch(function (error) {
            console.log("FAILED...", error);
            document.getElementById("error-message").style.display = "block"; // Afficher un message d'erreur
        });
    });
});