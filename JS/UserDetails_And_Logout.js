document.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("login-link");
  const userBox = document.getElementById("user-box");
  const userName = document.getElementById("user-name");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const logoutButton = document.getElementById("logout-button");
  const soldeValue = document.getElementById("solde-value");

  // Hide both elements initially to prevent flashing
  loginLink.classList.add("hidden");
  userBox.classList.add("hidden");

  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      // User is not logged in
      loginLink.classList.remove("hidden");
    } else {
      // User is logged in
      userBox.classList.remove("hidden");

      const fullName = user.user_metadata.fullname;
      userName.textContent = fullName || "Utilisateur";

      const clientId = user?.user_metadata?.client_id;

      // If user has a client_id, get it's solde
      if (clientId) {
        const { data: client, error } = await supabaseClient
          .from("client")
          .select("solde")
          .eq("id", clientId)
          .single();

        if (error) {
          console.error(
            "Erreur lors de la récupération du solde du client :",
            error
          );
        }

        const solde = client?.solde;
        soldeValue.textContent = solde || "0";
      }
    }
  } catch (error) {
    console.error("Auth error:", error);
    loginLink.classList.remove("hidden");
  }

  // Handle user box click
  userBox.addEventListener("click", (e) => {
    e.stopPropagation();
    userBox.classList.toggle("active");
    dropdownMenu.classList.toggle("hidden");
    logoutButton.classList.add("disabled-button");
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener("click", () => {
    userBox.classList.remove("active");
    dropdownMenu.classList.add("hidden");
  });

  // Prevent dropdown from closing when clicking inside it
  dropdownMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Handle logout
  logoutButton.addEventListener("click", async () => {
    try {
      logoutButton.disabled = true;
      logoutButton.classList.add("disabled-button");
      await supabaseClient.auth.signOut();
      window.location.href = "Connexion.html";
    } catch (error) {
      console.error("Logout error:", error);
      logoutButton.disabled = false;
    }
  });
});
