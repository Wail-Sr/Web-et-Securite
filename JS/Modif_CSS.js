// Définition des thèmes
const themes = {
    jungle: {
        "--couleur1": "rgba(10, 71, 36, 1)",
        "--couleur2": "rgba(10, 143, 39, 1)",
        "--couleur3": "rgba(7, 112, 30, 1)",
        "--couleur4": "rgba(53, 62, 57, 1)",
        "--couleur5": "rgba(32, 79, 42, 1)",
        "--couleur6": "rgba(2, 70, 17, 1)",
        "--couleur7": "rgba(10, 71, 36, 1)",
        "--couleur8": "rgba(10, 143, 39, 1)",
        "--couleur9": "rgba(7, 112, 30, 1)"
    },
    desert: {
        "--couleur1": "rgba(194, 140, 83, 1)",
        "--couleur2": "rgba(237, 201, 175, 1)",
        "--couleur3": "rgba(241, 194, 125, 1)",
        "--couleur4": "rgba(232, 157, 78, 1)",
        "--couleur5": "rgba(255, 183, 77, 1)",
        "--couleur6": "rgba(210, 105, 30, 1)",
        "--couleur7": "rgba(179, 134, 98, 1)",
        "--couleur8": "rgba(229, 152, 102, 1)",
        "--couleur9": "rgba(255, 228, 181, 1)"
    },
    foret: {
        "--couleur1": "rgba(50, 27, 12, 1)",
        "--couleur2": "rgba(34, 17, 7, 1)",
        "--couleur3": "rgba(72, 43, 20, 1)",
        "--couleur4": "rgba(20, 45, 25, 1)",
        "--couleur5": "rgba(10, 30, 15, 1)", 
        "--couleur6": "rgba(5, 20, 10, 1)",  
        "--couleur7": "rgba(80, 40, 20, 1)",   
        "--couleur8": "rgba(30, 60, 30, 1)",   
        "--couleur9": "rgba(15, 35, 15, 1)"    
    },
    mer: {
        "--couleur1": "rgba(0, 105, 148, 1)",
        "--couleur2": "rgba(0, 168, 232, 1)",
        "--couleur3": "rgba(3, 115, 171, 1)",
        "--couleur4": "rgba(28, 160, 206, 1)",
        "--couleur5": "rgba(72, 202, 228, 1)",
        "--couleur6": "rgba(144, 224, 239, 1)",
        "--couleur7": "rgb(10, 73, 119)",
        "--couleur8": "rgba(0, 130, 180, 1)",
        "--couleur9": "rgba(135, 206, 250, 1)"
    },
    montagne: {
        "--couleur1": "rgba(50, 50, 50, 1)",
        "--couleur2": "rgba(100, 100, 100, 1)",
        "--couleur3": "rgba(150, 150, 150, 1)",
        "--couleur4": "rgba(80, 80, 80, 1)",
        "--couleur5": "rgba(120, 120, 120, 1)",
        "--couleur6": "rgba(200, 200, 200, 1)",
        "--couleur7": "rgba(170, 170, 170, 1)",
        "--couleur8": "rgba(220, 220, 220, 1)",
        "--couleur9": "rgba(240, 240, 240, 1)" 
    }
};

// Récupère le thème depuis l'attribut `data-theme`
const themeName = document.body.getAttribute("data-theme");

// Applique les couleurs si le thème existe
if (themes[themeName]) {
    Object.entries(themes[themeName]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
}