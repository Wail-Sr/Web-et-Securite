<?php
header('Content-Type: application/json');

$pdo = new PDO("mysql:host=localhost;dbname=ta_base_de_donnees;charset=utf8", "utilisateur", "mot_de_passe");

$lieu = $_POST["lieu"] ?? "";
$ville = $_POST["ville"] ?? "";
$prix = $_POST["prix"] ?? 1000;
$capacite = $_POST["capacite"] ?? "";
$surface = $_POST["surface"] ?? 50;

$query = "SELECT * FROM maisons WHERE statut = 'disponible' AND prix_par_nuit <= :prix AND surface >= :surface";
$params = ["prix" => $prix, "surface" => $surface];

if ($lieu) {
    $query .= " AND type = :lieu";
    $params["lieu"] = $lieu;
}
if ($ville) {
    $query .= " AND (ville LIKE :ville OR pays LIKE :ville)";
    $params["ville"] = "%$ville%";
}
if ($capacite) {
    $query .= " AND capacite >= :capacite";
    $params["capacite"] = $capacite;
}

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);
?>
