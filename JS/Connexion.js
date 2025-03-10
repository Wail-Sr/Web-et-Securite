document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  checkAuth();

  // Setup event listeners
  if (document.getElementById("signup-form")) {
    document
      .getElementById("signup-form")
      .addEventListener("submit", handleSignup);
  }
  if (document.querySelector(".auth-form")) {
    document
      .querySelector(".auth-form")
      .addEventListener("submit", handleLogin);
  }
  if (document.getElementById("logout")) {
    document.getElementById("logout").addEventListener("click", handleLogout);
  }
});

async function checkAuth() {
  const session = await supabaseClient.auth.getSession();
  if (session && session.data.session) {
    if (
      window.location.pathname.includes("Connexion.html") ||
      window.location.pathname.includes("Inscription.html")
    ) {
      window.location.href = "index.html";
    }
  }
}

// Login Function
  async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Vérification des champs vides
    if (!email || !password) {
      showError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      showSuccess("Connexion réussie..! Redirection en cours..");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      showError("Email ou mot de passe incorrect");
      console.log(error);
    }
  }

// Signup Function
async function handleSignup(event) {
  event.preventDefault();

  const prenom = document.getElementById("prenom").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const fullname = `${prenom} ${nom}`;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("motdepasse").value;

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { fullname },
      },
    });

    if (error) throw error;

    console.log(data);

    showSuccess(
      "Inscription réussie..! Veuillez vérifier votre boîte de réception pour confirmer votre adresse e-mail."
    );
    setTimeout(() => {
      window.location.href = "Connexion.html";
    }, 5000);
  } catch (error) {
    showError("Une erreur s'est produite lors de l'inscription");
    console.log(error);
  }
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }, 5000);
  }
}

function showSuccess(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    errorDiv.style.color = "green";
    setTimeout(() => {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }, 5000);
  }
}
