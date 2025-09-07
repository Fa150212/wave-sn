// ---- Chargement utilisateur
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

const hKey = "history_" + user.phone;
const getHistory = () => JSON.parse(localStorage.getItem(hKey) || "[]");
const setHistory = (arr) => localStorage.setItem(hKey, JSON.stringify(arr));

// Profil
document.getElementById("user-display").textContent = user.fullname;
document.getElementById("user-phone").textContent = "+" + user.phone;
document.getElementById("user-photo").src = user.photo || "image/default.png";

// Solde 
const balanceEl = document.getElementById("balance");
const syncUser = (newBalance) => {
  const updated = { ...user, balance: newBalance };
  localStorage.setItem("user", JSON.stringify(updated));

// mettre à jour copie dans users[] 
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const idx = users.findIndex(u => u.phone === user.phone);
  if (idx !== -1) { users[idx].balance = newBalance; localStorage.setItem("users", JSON.stringify(users)); }

  balanceEl.textContent = newBalance;
};
balanceEl.textContent = user.balance ?? 0;

// QR Code
new QRCode(document.getElementById("qrcode"), {
  text: `Utilisateur: ${user.fullname} | Solde: ${balanceEl.textContent} FCFA`,
  width: 150, height: 150,
});

// Œil afficher/masquer
const eyeIcon = document.querySelector("#toggle-eye i");
let hidden = false;
document.getElementById("toggle-eye").addEventListener("click", () => {
  hidden = !hidden;
  if (hidden) {
    balanceEl.textContent = "****";
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    balanceEl.textContent = currentUser.balance;
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
});

// ---- Actions
const fmt = (n) => Math.round(Number(n));
const nowStr = () => new Date().toLocaleString();

const renderHistory = () => {
  const tbody = document.getElementById("history-body");
  tbody.innerHTML = "";
  getHistory().slice().reverse().forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.type}</td>
      <td>${item.details || "-"}</td>
      <td>${item.amount} FCFA</td>
      <td>${item.fee || 0} FCFA</td>
      <td>${item.when}</td>
    `;
    tbody.appendChild(tr);
  });
};
renderHistory();

// Transfert (2% frais)
document.getElementById("btn-transfer").addEventListener("click", () => {
  const name = document.getElementById("trf-name").value.trim();
  const amount = fmt(document.getElementById("trf-amount").value);
  const msg = document.getElementById("trf-msg");

  if (!name || !amount || amount <= 0) {
    msg.textContent = "Entrez un destinataire et un montant valide.";
    return;
  }
  const fee = fmt(amount * 0.02);
  const total = amount + fee;

  const current = JSON.parse(localStorage.getItem("user")).balance;
  if (total > current) {
    msg.textContent = "Solde insuffisant.";
    return;
  }

  const newBal = current - total;
  syncUser(newBal);

  const hist = getHistory();
  hist.push({ type: "Transfert", details: `À ${name}`, amount, fee, when: nowStr() });
  setHistory(hist);
  renderHistory();

  msg.textContent = `Transfert effectué. Frais: ${fee} FCFA.`;
  document.getElementById("trf-name").value = "";
  document.getElementById("trf-amount").value = "";
});

// Dépôt
document.getElementById("btn-deposit").addEventListener("click", () => {
  const amount = fmt(document.getElementById("dep-amount").value);
  const msg = document.getElementById("dep-msg");
  if (!amount || amount <= 0) { msg.textContent = "Montant invalide."; return; }

  const current = JSON.parse(localStorage.getItem("user")).balance;
  const newBal = current + amount;
  syncUser(newBal);

  const hist = getHistory();
  hist.push({ type: "Dépôt", details: "", amount, fee: 0, when: nowStr() });
  setHistory(hist);
  renderHistory();

  msg.textContent = "Dépôt réussi.";
  document.getElementById("dep-amount").value = "";
});

// Retrait
document.getElementById("btn-withdraw").addEventListener("click", () => {
  const amount = fmt(document.getElementById("wdr-amount").value);
  const msg = document.getElementById("wdr-msg");
  if (!amount || amount <= 0) { msg.textContent = "Montant invalide."; return; }

  const current = JSON.parse(localStorage.getItem("user")).balance;
  if (amount > current) { msg.textContent = "Solde insuffisant."; return; }

  const newBal = current - amount;
  syncUser(newBal);

  const hist = getHistory();
  hist.push({ type: "Retrait", details: "", amount, fee: 0, when: nowStr() });
  setHistory(hist);
  renderHistory();

  msg.textContent = "Retrait effectué.";
  document.getElementById("wdr-amount").value = "";
});

// Scanner
document.getElementById("btn-scan").addEventListener("click", () => {
  window.location.href = "scanner.html";
});

// Déconnexion
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

// --- Accordéon : ouverture/fermeture des sections
document.querySelectorAll(".action-title").forEach(title => {
  title.addEventListener("click", () => {
    document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
    title.parentElement.classList.add("active");
  });
});
