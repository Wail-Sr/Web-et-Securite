document.getElementById('formulairePaiement').addEventListener('submit', function(event) {
    event.preventDefault();

    const numeroCarte = document.getElementById('numeroCarte').value;
    const dateExpiration = document.getElementById('dateExpiration').value;
    const cvv = document.getElementById('cvv').value;
    const montant = document.getElementById('montant').value;
    const bonReduction = document.getElementById('bonReduction').value;
    const message = document.getElementById('message');

    if (!numeroCarte || numeroCarte.length < 16) {
        message.textContent = "Numéro de carte invalide.";
        return;
    }

    if (!dateExpiration.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        message.textContent = "Date d'expiration invalide.";
        return;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        message.textContent = "CVV invalide.";
        return;
    }

    if (!montant || montant <= 0) {
        message.textContent = "Montant invalide.";
        return;
    }

    if (bonReduction) {
        message.textContent = `Paiement de ${montant}€ effectué avec le bon de réduction !`;
    } else {
        message.textContent = `Paiement de ${montant}€ effectué avec succès !`;
    }

    setTimeout(() => {
        document.getElementById('formulairePaiement').reset();
        message.textContent = "";
    }, 3000);
});
