const config = window.LAKUCRAFT_CONFIG || {};
const address = (config.serverAddress || "").trim();
const addressElement = document.getElementById("server-address");
const copyButton = document.getElementById("copy-address");
const note = document.getElementById("address-note");
const toast = document.getElementById("toast");

const statusPill = document.getElementById("server-status");
const statusBadge = document.getElementById("server-status-badge");
const statusText = document.getElementById("server-status-text");
const playerCount = document.getElementById("player-count");
const serverVersion = document.getElementById("server-version");
if (serverVersion) serverVersion.textContent = config.recommendedMinecraftVersion || "1.21.11+";

async function loadServerStatus() {
  if (!statusPill || !address) return;
  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error("Statuspalvelu ei vastannut.");
    const data = await response.json();
    const online = data.online === true;
    statusPill.classList.toggle("status-online", online);
    statusPill.classList.toggle("status-offline", !online);
    statusPill.classList.remove("status-checking");
    if (statusBadge) statusBadge.textContent = online ? "Online" : "Offline";
    if (statusText) statusText.textContent = online ? "Toiminnassa" : "Ei tavoitettavissa";
    if (playerCount) {
      const current = Number(data.players?.online ?? 0);
      const maximum = data.players?.max;
      playerCount.textContent = maximum == null ? `${current}` : `${current} / ${maximum}`;
    }
  } catch {
    statusPill.classList.remove("status-checking");
    statusPill.classList.add("status-offline");
    if (statusBadge) statusBadge.textContent = "Ei saatavilla";
    if (statusText) statusText.textContent = "Tilaa ei voitu tarkistaa";
    if (playerCount) playerCount.textContent = "—";
  }
}

loadServerStatus();

if (address && addressElement && copyButton && note) {
  addressElement.textContent = address;
  copyButton.disabled = false;
  note.textContent = "Klikkaa Kopioi ja liitä osoite Minecraftin palvelinvalikkoon.";
}

copyButton?.addEventListener("click", async () => {
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    toast.textContent = "Palvelimen osoite kopioitu.";
  } catch {
    toast.textContent = `Palvelimen osoite: ${address}`;
  }
  if (toast) {
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2400);
  }
});

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
