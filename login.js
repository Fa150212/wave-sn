// Seed d'utilisateurs (si vide)
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { fullname: "Fatou Gueye", phone: "771234567", code: "1234", balance: 0, photo: "image/fatou.jpg" },
    { fullname: "Dame Ndiaye", phone: "781112233", code: "4321", balance: 0, photo: "image/dame.jpg" }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// Connexion step 1 (nom + téléphone)
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const fullname = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.fullname === fullname && u.phone === phone);

  if (user) {
    localStorage.setItem("tempUser", JSON.stringify(user));
    window.location.href = "code.html";
  } else {
    document.getElementById("login-error").textContent = "Utilisateur inconnu ❌";
  }
});
