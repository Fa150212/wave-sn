const tempUser = JSON.parse(localStorage.getItem("tempUser"));
if (!tempUser) window.location.href = "login.html";

document.getElementById("code-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("code").value.trim();

  if (code === tempUser.code) {
    // solde à 0 à la connexion
    const logged = { ...tempUser, balance: 0 };
    localStorage.setItem("user", JSON.stringify(logged));
    localStorage.removeItem("tempUser");
    // init historique si besoin
    const hKey = "history_" + logged.phone;
    if (!localStorage.getItem(hKey)) localStorage.setItem(hKey, JSON.stringify([]));
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("code-error").textContent = "Code incorrect ❌";
  }
});
