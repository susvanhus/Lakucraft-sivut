const config = window.LAKUCRAFT_CONFIG || {};
const address = (config.serverAddress || "").trim();
const addressElement = document.getElementById("server-address");
const copyButton = document.getElementById("copy-address");
const note = document.getElementById("address-note");
const toast = document.getElementById("toast");

if (address) {
  addressElement.textContent = address;
  copyButton.disabled = false;
  note.textContent = "Klikkaa Kopioi ja liitä osoite Minecraftin palvelinvalikkoon.";
}

copyButton.addEventListener("click", async () => {
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    toast.textContent = "Palvelimen osoite kopioitu.";
  } catch {
    toast.textContent = `Palvelimen osoite: ${address}`;
  }
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
});

document.getElementById("year").textContent = new Date().getFullYear();
