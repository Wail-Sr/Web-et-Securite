document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');

    // Ouvrir / Fermer le menu mobile
    menuToggle.addEventListener('click', function () {
        navContainer.classList.toggle('open');
    });

    // Fermer le menu lorsqu'on clique à l'extérieur
    document.addEventListener('click', function (event) {
        if (!navContainer.contains(event.target) && !menuToggle.contains(event.target)) {
            navContainer.classList.remove('open');
        }
    });

    // Vérifier la taille de l'écran et afficher le menu en conséquence
    function checkScreenSize() {
        if (window.innerWidth > 768) {
            navContainer.classList.remove('open');
        }
    }

    window.addEventListener('resize', checkScreenSize);
});