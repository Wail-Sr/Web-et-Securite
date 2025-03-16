document.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("login-link");
  const userBox = document.getElementById("user-box");
  const userName = document.getElementById("user-name");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const logoutButton = document.getElementById("logout-button");

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

      console.log(user);

      const fullName = user.user_metadata.fullname;
      userName.textContent = fullName || "Utilisateur";
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
      logoutButton.disabled = false
    }
  });
});
