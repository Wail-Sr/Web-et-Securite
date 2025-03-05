const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = 3000;
const CLIENT_DB = path.join(__dirname, "Data_Base", "Client.json");
const RESERVATION_DB = path.join(__dirname, "Data_Base", "Reservation.json");

app.use(cors());
app.use(bodyParser.json());

// Charger la base de données clients
function loadClients() {
    if (fs.existsSync(CLIENT_DB)) {
        return JSON.parse(fs.readFileSync(CLIENT_DB, "utf8"));
    }
    return { clients: [] };
}

// Sauvegarder la base de données clients
function saveClients(data) {
    try {
        fs.writeFileSync(CLIENT_DB, JSON.stringify(data, null, 4), "utf8");
        console.log("✅ Client.json mis à jour !");
    } catch (err) {
        console.error("❌ Erreur d'écriture dans Client.json :", err);
    }
}

// Charger la base de données des réservations
function loadReservations() {
    if (fs.existsSync(RESERVATION_DB)) {
        return JSON.parse(fs.readFileSync(RESERVATION_DB, "utf8"));
    }
    return { reservations: [] };
}

// Sauvegarder les réservations
function saveReservations(data) {
    try {
        fs.writeFileSync(RESERVATION_DB, JSON.stringify(data, null, 4), "utf8");
        console.log("✅ Reservation.json mis à jour !");
    } catch (err) {
        console.error("❌ Erreur d'écriture dans Reservation.json :", err);
    }
}

// Hasher un mot de passe (SHA-256)
function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

// Route pour INSCRIPTION avec vérification de l'email et solde aléatoire
app.post("/register", (req, res) => {
    let { nom, prenom, email, telephone, motdepasse } = req.body;
    let db = loadClients();

    // Vérifier si l'email est déjà utilisé
    if (db.clients.some(client => client.email === email)) {
        return res.status(400).json({ message: "Cet email est déjà enregistré, veuillez en choisir un autre." });
    }

    // Générer un solde aléatoire entre 100€ et 1000€
    let solde = Math.floor(Math.random() * 901) + 100;

    // Créer un nouvel utilisateur
    let newUser = {
        id: String(db.clients.length + 1),
        nom,
        prenom,
        email,
        telephone,
        motdepasse: hashPassword(motdepasse),
        solde
    };

    db.clients.push(newUser);
    saveClients(db);

    res.json({ message: "Inscription réussie !", solde });
});

// Route pour CONNEXION
app.post("/login", (req, res) => {
    let { email, motdepasse } = req.body;
    let db = loadClients();

    let user = db.clients.find(client => client.email === email);
    if (!user) {
        return res.status(400).json({ message: "Email incorrect ou non enregistré." });
    }

    if (user.motdepasse !== hashPassword(motdepasse)) {
        return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    res.json({
        message: "Connexion réussie !",
        user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, solde: user.solde }
    });
});

// 📌 Route pour récupérer les réservations d'un bien immobilier
app.get("/reservations/:idImmobilier", (req, res) => {
    let idImmobilier = req.params.idImmobilier;
    let db = loadReservations();

    let reservations = db.reservations.filter(res => res.idImmobilier === idImmobilier);
    res.json(reservations);
});

// 📌 Route pour réserver un bien immobilier
app.post("/reserve", (req, res) => {
    let { idClient, idImmobilier, dateDebut, dateFin } = req.body;
    let db = loadReservations();

    // Vérifier si la date est déjà réservée
    let conflit = db.reservations.some(reservation =>
        reservation.idImmobilier === idImmobilier &&
        ((dateDebut >= reservation.dateDebut && dateDebut <= reservation.dateFin) ||
            (dateFin >= reservation.dateDebut && dateFin <= reservation.dateFin) ||
            (reservation.dateDebut >= dateDebut && reservation.dateDebut <= dateFin))
    );

    if (conflit) {
        return res.status(400).json({ message: "Les dates sélectionnées sont déjà réservées." });
    }

    // Ajouter la réservation
    let newReservation = {
        id: String(db.reservations.length + 1),
        idClient,
        idImmobilier,
        dateDebut,
        dateFin
    };

    db.reservations.push(newReservation);
    saveReservations(db);

    res.json({ message: "Réservation confirmée !" });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
