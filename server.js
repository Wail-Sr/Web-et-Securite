const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = 3000;
const CLIENT_DB = "Data_Base/Client.json";

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
    fs.writeFileSync(CLIENT_DB, JSON.stringify(data, null, 4), "utf8");
}

// Hasher un mot de passe (SHA-256)
function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

// Route pour INSCRIPTION
app.post("/register", (req, res) => {
    let { nom, prenom, email, telephone, motdepasse } = req.body;
    let db = loadClients();

    // Vérifier si l'email existe déjà
    if (db.clients.some(client => client.email === email)) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Créer un nouvel utilisateur
    let newUser = {
        id: String(db.clients.length + 1),
        nom,
        prenom,
        email,
        telephone,
        motdepasse: hashPassword(motdepasse) // Stockage du mot de passe hashé
    };

    db.clients.push(newUser);
    saveClients(db);

    res.json({ message: "Inscription réussie !" });
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
        user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email }
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
