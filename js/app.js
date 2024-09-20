import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

const WHATSAPP_PHONE = "+79104256479";

const heroSwipers = new Swiper(".hero-swiper", {
  // configure Swiper to use modules
  modules: [Navigation],
  navigation: {
    nextEl: ".hero-swiper-next",
    prevEl: ".hero-swiper-previous",
  },
});

// Sync Swiper with select
// create options for select from slides
heroSwipers.map((swiper) => {
  const swiperEl = swiper.el;
  const selectId = swiperEl.getAttribute("data-select-id");
  swiper.linkedSelectId = selectId || null;
  const slides = swiper.slides;
  const selectEl = document.querySelector(`#${selectId}`);
  // Subscribe slider selectors to slider changes
  function handleSelectChange(e) {
    const targetSelect = document
      .querySelector(`#${e.detail.selectId}`)
      .closest(".custom-select");
    const targetOption = targetSelect.querySelectorAll(
      `[data-index~="${e.detail.selectedIndex}"]`
    );

    if (targetOption) {
      targetOption[0]?.click();
    }
  }
  selectEl?.addEventListener("changeSelectFromSlider", handleSelectChange);

  function setContactLinks(swiper) {
    const activeSlideIndex = swiper.activeIndex;
    const projectsBlock = swiperEl.closest(".projects-block");
    const contactLink = projectsBlock.querySelector(".project-button");
    const currentSlide = swiper.slides[activeSlideIndex];
    const projectName =
      currentSlide.querySelector(".headline-2").textContent || null;
    contactLink.href = projectName
      ? `https://wa.me/${WHATSAPP_PHONE}?text=Здравствуйте, расскажите пожалуйста подробнее о проекте "${projectName}"`
      : `https://wa.me/${WHATSAPP_PHONE}?text=Здравствуйте, расскажите пожалуйста подробнее о ваших услугах"`;
  }

  if (slides?.length && selectEl) {
    slides.forEach((slide, key) => {
      const optionEl = document.createElement("option");
      optionEl.value = key;
      optionEl.addEventListener("click", (e) => {
        swiper.slideTo(key);
      });
      optionEl.innerHTML =
        slide.querySelector(".headline-2").textContent ||
        "укажите заголовок слайда";
      selectEl.appendChild(optionEl);
      if ([...slide.classList].indexOf("swiper-slide-active") > 0) {
        selectEl.selectedIndex = key;
      }
    });
    setTimeout(setContactLinks(swiper), 0);

    // on changing slide, need to set select with new value
    swiper.on("slideChange", function (swiper) {
      const activeSlideIndex = swiper.activeIndex;
      selectEl.selectedIndex = String(activeSlideIndex);
      setContactLinks(swiper);
      selectEl.dispatchEvent(
        new CustomEvent("changeSelectFromSlider", {
          detail: {
            selectId: selectEl.id,
            selectedIndex: swiper.activeIndex,
          },
        })
      );
    });

    // update contact button text with slides
  }
});

// on select change slide

// HANDLING POPUP MENU
const menu = document.querySelector("#mobile-menu");
const body = document.querySelector("body");
const menuItems = document.querySelectorAll(".popup-menu-item");
const hamburger = document.querySelector(".hamburger-button");
const closeIcon = document.querySelector(".popup-menu-cross-button");

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

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

// CUSTOM SELECT LOGIC
let customSelectsArr,
  htmlSelect,
  selectedOption,
  customOptionsContainer,
  customOption;
/* Look for any elements with the class "custom-select": */
customSelectsArr = document.getElementsByClassName("custom-select");

for (let i = 0; i < customSelectsArr.length; i++) {
  htmlSelect = customSelectsArr[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  selectedOption = document.createElement("DIV");
  selectedOption.setAttribute("class", "select-selected");
  selectedOption.innerHTML =
    htmlSelect.options[htmlSelect.selectedIndex].innerHTML;
  customSelectsArr[i].appendChild(selectedOption);
  /* For each element, create a new DIV that will contain the option list: */
  customOptionsContainer = document.createElement("DIV");
  customOptionsContainer.setAttribute("class", "select-items select-hide");
  for (let j = 0; j < htmlSelect.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    customOption = document.createElement("DIV");
    customOption.innerHTML = htmlSelect.options[j].innerHTML;
    customOption.dataset.index = j;

    customOptionsContainer.appendChild(customOption);

    customOption.addEventListener("click", function (e) {
      const targetEl = e.target;
      /* When an item is clicked, update the original select box,
        and the selected item: */
      let y, k, htmlSelectUpdate, customSelectedOption, yl;
      htmlSelectUpdate =
        targetEl.parentNode.parentNode.getElementsByTagName("select")[0];

      let optionsAmount = htmlSelectUpdate.length;

      customSelectedOption = targetEl.parentNode.previousSibling;
      for (let i = 0; i < optionsAmount; i++) {
        if (htmlSelectUpdate.options[i].innerHTML == targetEl.innerHTML) {
          htmlSelectUpdate.selectedIndex = i;
          htmlSelectUpdate[i].click();
          customSelectedOption.innerHTML = targetEl.innerHTML;
          y = targetEl.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          targetEl.setAttribute("class", "same-as-selected");
          break;
        }
      }
      customSelectedOption.click();
    });
  }
  customSelectsArr[i].appendChild(customOptionsContainer);

  selectedOption.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    const targetEl = e.target;
    e.stopPropagation();
    closeAllSelect(targetEl);
    targetEl.nextSibling.classList.toggle("select-hide");
    targetEl.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
