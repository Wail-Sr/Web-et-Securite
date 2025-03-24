document.getElementById('formulairePaiement').addEventListener('submit', async function(event) {
    event.preventDefault();

    const numeroCarte = document.getElementById('numeroCarte').value;
    const dateExpiration = document.getElementById('dateExpiration').value;
    const cvv = document.getElementById('cvv').value;
    const montant = parseFloat(document.getElementById('montant').value);
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

    try {
        if (authError) throw authError;

        if (!user) {
            message.textContent = "Utilisateur non connecté.";
            return;
        }

        const userId = user?.id;
        if (!userId) {
            message.textContent = "ID utilisateur manquant.";
            return;
        }

        // Récupérer le solde actuel du client
        const { data: client, error: fetchError } = await supabaseClient
            .from('client')
            .select('solde')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        const soldeActuel = client?.solde || 0;
        const nouveauSolde = soldeActuel + montant;
        const { error: updateError } = await supabaseClient
            .from('client')
            .update({ solde: nouveauSolde })
            .eq('user_id', userId);

        if (updateError) throw updateError;


        if (bonReduction) {
            message.textContent = `Paiement de ${montant}€ effectué avec le bon de réduction ! Nouveau solde : ${nouveauSolde}€`;
        } else {
            message.textContent = `Paiement de ${montant}€ effectué avec succès ! Nouveau solde : ${nouveauSolde}€`;
        }

        setTimeout(() => {
            document.getElementById('formulairePaiement').reset();
            message.textContent = "";

            window.history.back();
        }, 3000);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du solde :", error);
        message.textContent = "Une erreur est survenue lors du paiement.";
    }
});
