"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navegacion");
const mobile = window.matchMedia("(max-width: 39.99rem)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// En escritorio la navegación siempre está visible.
function setMenu(open) {
  const focusWasInNav = navigation.contains(document.activeElement);
  menuButton.hidden = !mobile.matches;
  menuButton.setAttribute("aria-expanded", String(mobile.matches && open));
  navigation.hidden = mobile.matches && !open;
  if (navigation.hidden && focusWasInNav) menuButton.focus();
}

document.body.classList.add("menu-ready");
setMenu(false);
mobile.addEventListener("change", () => setMenu(false));

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") === "false");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});

// Conserva el ancla en la URL y mueve el foco al destino.
document.querySelectorAll(".header a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = link.getAttribute("href");
    const section = document.querySelector(anchor);
    if (!section) return;

    event.preventDefault();
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
    setMenu(false);
    if (window.location.hash !== anchor) window.history.pushState(null, "", anchor);
    section.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth" });
  });
});

// Anima cada bloque una sola vez al entrar en pantalla.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.remove("will-reveal");
      target.classList.add("revealed");
      observer.unobserve(target);
    });
  });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add("will-reveal");
    observer.observe(element);
  });
}
