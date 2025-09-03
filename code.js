
const tempUser = JSON.parse(localStorage.getItem("tempUser"));

if (!tempUser) {
  window.location.href = "login.html";
}

document.getElementById("code-form").addEventListener("submit", e => {
  e.preventDefault();
  const code = document.getElementById("code").value.trim();

  if (code === tempUser.code) {
    tempUser.balance = 0; // solde initialisé à 0
    localStorage.setItem("user", JSON.stringify(tempUser));
    localStorage.removeItem("tempUser");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("code-error").textContent = "Code incorrect ❌";
  }
});
