CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);

INSERT INTO client (nom, prenom, email, telephone, mot_de_passe) VALUES
('Dupont', 'Jean', 'jean.dupont@exemple.com', '0612345678', 'HASHED_1234'),
('Martin', 'Sophie', 'sophie.martin@exemple.com', '0698765432', 'HASHED_1235'),
('Leroy', 'Pierre', 'pierre.leroy@exemple.com', '0644556677', 'HASHED_1236'),
('Dubois', 'Marie', 'marie.dubois@exemple.com', '0733547612', 'HASHED_1237'),
('Lambert', 'Luc', 'luc.lambert@exemple.com', '0722749145', 'HASHED_1238');

CREATE TABLE type_maison (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO type_maison (nom) VALUES
('desert'),
('mer'),
('jungle'),
('montagne'),
('foret');

CREATE TABLE statut_maison (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50) NOT NULL
);

INSERT INTO statut_maison (status) VALUES
('disponible'),
('reserve');

CREATE TABLE maisons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    ville VARCHAR(50) NOT NULL,
    pays VARCHAR(50) NOT NULL,
    id_type INT NOT NULL,
    prix_par_nuit DECIMAL(10, 2) NOT NULL CHECK (prix_par_nuit BETWEEN 100 AND 10000),
    capacite INT NOT NULL,
    id_statut INT NOT NULL,
    equipements TEXT,
    FOREIGN KEY (id_type) REFERENCES type_maison(id) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES statut_maison(id) ON DELETE CASCADE
);

INSERT INTO maisons (description, ville, pays, id_type, prix_par_nuit, capacite, id_statut) VALUES
('Belle maison en bord de mer', 'Nice', 'France', 2, 150.00, 4, 1),
('Chalet cosy en montagne', 'Chamonix', 'France', 4, 200.00, 6, 1),
('Maison traditionnelle dans le désert', 'Djanet', 'Algérie', 1, 120.00, 4, 2),
('Lodge Aventure en Jungle', 'Amazonie', 'Brésil', 3, 220.00, 4, 1),
('Villa luxueuse avec vue sur la mer', 'Canes', 'France', 2, 300.00, 8, 1),
('Cabane isolée dans la foret', 'Annecy', 'France', 5, 100.00, 2, 2);

CREATE TABLE statut_reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO statut_reservation (nom) VALUES
('en attente'),
('confirmee'),
('annulee');


CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_locataire INT,
    id_maison INT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    id_statut INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_locataire) REFERENCES client(id) ON DELETE CASCADE,
    FOREIGN KEY (id_maison) REFERENCES maisons(id) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES statut_reservation(id) ON DELETE CASCADE
);

INSERT INTO reservations (id_locataire, id_maison, date_debut, date_fin, id_statut) VALUES
(1, 1, '2023-12-01', '2023-12-07', 2),
(2, 3, '2023-11-15', '2023-11-20', 3),
(1, 2, '2024-01-10', '2024-01-15', 1),
(3, 4, '2024-02-01', '2024-02-07', 2),
(4, 5, '2024-03-01', '2024-03-10', 1),
(5, 6, '2024-04-15', '2024-04-20', 2);


CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_locataire INT NOT NULL,
    id_maison INT NOT NULL,
    note INT,
    commentaire TEXT,
    date_avis DATE NOT NULL,
    FOREIGN KEY (id_locataire) REFERENCES client(id) ON DELETE CASCADE,
    FOREIGN KEY (id_maison) REFERENCES maisons(id) ON DELETE CASCADE,
    CHECK (note BETWEEN 1 AND 5)
);

INSERT INTO avis (id_locataire, id_maison, note, commentaire, date_avis) VALUES
(1, 1, 5, 'Super séjour, tout était parfait !', '2025-01-02'),
(2, 3, 3, 'Bien, mais un peu isolé.', '2023-11-25'),
(1, 2, 4, 'Chalet très confortable, je recommande.', '2024-01-20'),
(3, 4, 5, 'Un cadre magnifique, très calme.', '2024-02-10'),
(4, 5, 4, 'Villa de rêve, un peu chère.', '2024-03-15'),
(5, 6, 5, 'Parfait pour un week-end en amoureux.', '2024-08-15');

CREATE TABLE statut_paiement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO statut_paiement (nom) VALUES
('paye'),
('en attente'),
('annule');

CREATE TABLE methode_paiement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO methode_paiement (nom) VALUES
('carte'),
('PayPal'),
('autre');

CREATE TABLE paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reservation INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    id_statut INT NOT NULL DEFAULT 2,
    id_methode_paiement INT NOT NULL,
    date_paiement DATE NOT NULL,
    FOREIGN KEY (id_reservation) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES statut_paiement(id) ON DELETE CASCADE,
    FOREIGN KEY (id_methode_paiement) REFERENCES methode_paiement(id) ON DELETE CASCADE
);

INSERT INTO paiements (id_reservation, montant, id_statut, id_methode_paiement, date_paiement) VALUES
(1, 1050.00, 1, 1, '2023-11-20'),
(2, 600.00, 3, 2, '2023-11-10'),
(3, 1000.00, 2, 1, '2024-01-05'),
(4, 1260.00, 1, 1, '2024-01-25'),
(5, 2700.00, 2, 2, '2024-02-20'),
(6, 500.00, 1, 1, '2024-04-10');

CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_maison INT,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_maison) REFERENCES maisons(id) ON DELETE CASCADE
);


INSERT INTO photos (id_maison, url) VALUES
(1, 'https://example.com/maison1.jpg'),
(1, 'https://example.com/maison1_interieur.jpg'),
(2, 'https://example.com/chalet_montagne.jpg'),
(3, 'https://example.com/maison_desert.jpg'),
(4, 'https://example.com/cottage_campagne.jpg'),
(5, 'https://example.com/villa_luxueuse.jpg');