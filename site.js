let siteLanguage = "hr";

function refreshSiteIcons() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function applySiteLanguage(language) {
  siteLanguage = language === "en" ? "en" : "hr";
  document.documentElement.lang = siteLanguage;

  document.querySelectorAll("[data-hr][data-en]").forEach((element) => {
    element.textContent = element.dataset[siteLanguage];
  });

  document.querySelectorAll("[data-aria-hr][data-aria-en]").forEach((element) => {
    element.setAttribute("aria-label", element.dataset[`aria${siteLanguage === "hr" ? "Hr" : "En"}`]);
  });

  document.querySelectorAll(".language-button").forEach((button) => {
    const isActive = button.dataset.lang === siteLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.title = document.body.classList.contains("login-page")
    ? (siteLanguage === "hr" ? "Prijava | Millena AI" : "Sign in | Millena AI")
    : (siteLanguage === "hr" ? "Millena AI | Sadržaj koji radi sam" : "Millena AI | Content that runs itself");

  refreshSiteIcons();
}

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => applySiteLanguage(button.dataset.lang));
});

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open") || false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", siteLanguage === "hr"
    ? (isOpen ? "Zatvori izbornik" : "Otvori izbornik")
    : (isOpen ? "Close menu" : "Open menu"));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const parallaxItems = [
  { element: document.querySelector(".hero-texture"), section: document.querySelector(".hero-section"), speed: 0.055 },
  { element: document.querySelector(".web-backdrop img"), section: document.querySelector(".web-section"), speed: 0.09 },
  { element: document.querySelector(".closing-section > img"), section: document.querySelector(".closing-section"), speed: 0.075 },
].filter((item) => item.element && item.section);

let motionFrame = 0;

function updatePageMotion() {
  motionFrame = 0;
  document.querySelector(".site-header")?.classList.toggle("scrolled", window.scrollY > 18);
  if (reducedMotion.matches) return;

  const mobileFactor = window.innerWidth < 700 ? 0.55 : 1;
  parallaxItems.forEach(({ element, section, speed }) => {
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom < -120 || bounds.top > window.innerHeight + 120) return;
    const distanceFromCenter = (window.innerHeight / 2) - (bounds.top + bounds.height / 2);
    const offset = Math.max(-52, Math.min(52, distanceFromCenter * speed * mobileFactor));
    element.style.setProperty("--parallax-offset", `${offset.toFixed(1)}px`);
  });
}

function requestPageMotion() {
  if (motionFrame) return;
  motionFrame = window.requestAnimationFrame(updatePageMotion);
}

window.addEventListener("scroll", requestPageMotion, { passive: true });
window.addEventListener("resize", requestPageMotion, { passive: true });
requestPageMotion();

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("in-view");
});

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    const demo = button.dataset.demo;

    document.querySelectorAll("[data-demo]").forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll("[data-demo-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.demoPanel === demo);
    });

    requestAnimationFrame(refreshSiteIcons);
  });
});

document.querySelectorAll(".faq-list article").forEach((item) => {
  const button = item.querySelector("button");
  button?.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");

    document.querySelectorAll(".faq-list article").forEach((other) => {
      other.classList.remove("open");
      const otherButton = other.querySelector("button");
      const otherIcon = otherButton?.querySelector("svg");
      otherButton?.setAttribute("aria-expanded", "false");
      if (otherIcon) otherIcon.setAttribute("data-lucide", "plus");
    });

    item.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    const icon = button.querySelector("svg");
    if (icon) icon.setAttribute("data-lucide", willOpen ? "minus" : "plus");
    refreshSiteIcons();
  });
});

const loginForm = document.querySelector("#login-form");

function enterApp(target = "app.html") {
  sessionStorage.setItem("millena-auth", "1");
  window.location.href = target;
}

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submit = loginForm.querySelector(".login-submit");
  const label = submit?.querySelector("span");
  if (submit) submit.disabled = true;
  if (label) label.textContent = siteLanguage === "hr" ? "Otvaram aplikaciju..." : "Opening app...";
  window.setTimeout(() => enterApp("app.html"), 380);
});

document.querySelectorAll("[data-enter-app]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    enterApp(button.dataset.appTarget || "app.html");
  });
});

document.querySelector(".password-toggle")?.addEventListener("click", (event) => {
  const input = document.querySelector('input[name="password"]');
  if (!input) return;
  const showPassword = input.type === "password";
  input.type = showPassword ? "text" : "password";
  event.currentTarget.setAttribute("aria-label", siteLanguage === "hr"
    ? (showPassword ? "Sakrij lozinku" : "Prikaži lozinku")
    : (showPassword ? "Hide password" : "Show password"));
  const icon = event.currentTarget.querySelector("svg");
  if (icon) icon.setAttribute("data-lucide", showPassword ? "eye-off" : "eye");
  refreshSiteIcons();
});

applySiteLanguage("hr");
refreshSiteIcons();
