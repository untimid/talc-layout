import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

const heroSwiper = new Swiper(".hero-swiper", {
  // configure Swiper to use modules
  modules: [Navigation],
  navigation: {
    nextEl: ".hero-swiper-next",
    prevEl: ".hero-swiper-previous",
  },
});

const menu = document.querySelector("#mobile-menu");
const body = document.querySelector("body");
const menuItems = document.querySelectorAll(".popup-menu-item");
const hamburger = document.querySelector(".hamburger-button");
const closeIcon = document.querySelector(".popup-menu-cross-button");

function toggleMenu() {
  if (menu.classList.contains("popup-menu-visible")) {
    menu.classList.add("popup-menu-hidden");
    menu.classList.remove("popup-menu-visible");
    body.classList.remove("freeze-body");
  } else {
    menu.classList.add("popup-menu-visible");
    body.classList.add("freeze-body");
    menu.classList.remove("popup-menu-hidden");
  }
}
closeIcon.addEventListener("click", toggleMenu);
hamburger.addEventListener("click", toggleMenu);
menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});
