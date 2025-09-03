
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

// Affichage profil
document.getElementById("user-display").innerText = user.fullname;
document.getElementById("user-photo").src = user.photo;

const balanceEl = document.getElementById("balance");
balanceEl.innerText = user.balance;

// Génération QR Code
new QRCode(document.getElementById("qrcode"), {
  text: `Utilisateur: ${user.fullname} | Solde: ${user.balance} FCFA`,
  width: 150,
  height: 150,
});

// Masquer / afficher le solde
let isHidden = false;
document.getElementById("toggle-eye").addEventListener("click", () => {
  if (isHidden) {
    balanceEl.innerText = user.balance;
    document.getElementById("toggle-eye").innerText = "👁️";
  } else {
    balanceEl.innerText = "****";
    document.getElementById("toggle-eye").innerText = "🙈";
  }
  isHidden = !isHidden;
});

// Bouton scanner (redirige vers scanner.html)
document.getElementById("btn-scan").addEventListener("click", () => {
  window.location.href = "scanner.html";
});

// Déconnexion
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});
