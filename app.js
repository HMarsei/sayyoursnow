const screens = [...document.querySelectorAll(".screen")];
const goTo = (id) => {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "instant" });
};

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => goTo(btn.dataset.go));
});

const sentenceInput = document.getElementById("sentenceInput");
const charCount = document.getElementById("charCount");
const nameInput = document.getElementById("nameInput");
const countryInput = document.getElementById("countryInput");
const yearInput = document.getElementById("yearInput");
const tagsInput = document.getElementById("tagsInput");

sentenceInput.addEventListener("input", () => {
  charCount.textContent = sentenceInput.value.length;
});

const inspirations = [
  "Maybe the point was never to arrive.",
  "Be careful what you postpone. Life notices.",
  "You only get one first draft of today.",
  "The best stories usually begin with a bad idea.",
  "Say less. Mean more."
];

document.getElementById("inspireBtn").addEventListener("click", () => {
  const idea = inspirations[Math.floor(Math.random() * inspirations.length)];
  sentenceInput.value = idea;
  charCount.textContent = idea.length;
  sentenceInput.focus();
});

document.getElementById("publishBtn").addEventListener("click", () => {
  const sentence = sentenceInput.value.trim();
  if (!sentence) {
    sentenceInput.focus();
    return;
  }

  const name = nameInput.value.trim() || "Anonymous";
  const country = countryInput.value.trim() || "Somewhere";
  const year = yearInput.value.trim() || new Date().getFullYear();
  document.getElementById("checkoutSentence").textContent = sentence;
  document.getElementById("checkoutAuthor").textContent = `${name} · ${country} · ${year}`;
  goTo("checkout");
});

function finishDemoPayment() {
  const sentence = sentenceInput.value.trim();
  const name = nameInput.value.trim() || "Anonymous";
  const country = countryInput.value.trim() || "Somewhere";
  const year = yearInput.value.trim() || new Date().getFullYear();
  const number = String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0");

  document.getElementById("successSentence").textContent = sentence;
  document.getElementById("successMeta").textContent = `${name} · ${country} · ${year}`;
  document.getElementById("permanentNumber").textContent = `#${number}`;

  localStorage.setItem("sayyours:last", JSON.stringify({
    sentence, name, country, year, tags: tagsInput.value.trim(), number
  }));

  goTo("success");
}

["applePayBtn", "googlePayBtn", "paypalBtn"].forEach(id => {
  document.getElementById(id).addEventListener("click", finishDemoPayment);
});

document.getElementById("anotherBtn").addEventListener("click", () => {
  sentenceInput.value = "";
  nameInput.value = "";
  countryInput.value = "";
  yearInput.value = "";
  tagsInput.value = "";
  charCount.textContent = "0";
  goTo("write");
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    document.getElementById("copyBtn").textContent = "COPIED!";
    setTimeout(() => document.getElementById("copyBtn").textContent = "COPY LINK", 1400);
  } catch {
    alert("Copy this address: " + window.location.href);
  }
});

/* Messages from the isolated Master Final HOME */
window.addEventListener("message", (event) => {
  if (!event.data || typeof event.data !== "object") return;
  if (event.data.type === "sayyours-go-write") goTo("write");
  if (event.data.type === "sayyours-height") {
    const frame = document.getElementById("masterFrame");
    if (frame && Number(event.data.height) > 0) {
      frame.style.height = `${Math.ceil(event.data.height)}px`;
    }
  }
});
