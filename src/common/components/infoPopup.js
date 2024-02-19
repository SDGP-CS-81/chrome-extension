import { categories } from "../constants.js";

class InfoPopup extends HTMLElement {
  generateTemplate(category) {
    const template = document.createElement("template");
    template.innerHTML = `
    <div class="relative ml-2 hidden items-center @[400px]/dropdown:block">
      <svg
        class="dropdown-info-icon h-6 w-full cursor-pointer stroke-current dark:text-white"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div
        class="popup absolute right-0 top-0 z-[10] flex hidden w-72 -translate-y-[70px] translate-x-[300px] transform items-center rounded-md border border-grey-low bg-secondary-light p-2 dark:border-grey-high dark:bg-grey-high"
      >
        <p class="text-sm text-black dark:text-white">${category.desc}</p>
        <img
          src="${category.descImg}"
          alt="Category type"
          class="ml-6 h-28 w-28 rounded-md"
        />
      </div>
    </div>`;
    return template;
  }

  connectedCallback() {
    this.categoryId = this.getAttribute("category-id");

    this.appendChild(
      this.generateTemplate(categories[this.categoryId]).content.cloneNode(true)
    );

    const infoIcon = this.querySelector(".dropdown-info-icon");
    const popup = this.querySelector(".popup");

    infoIcon.addEventListener("click", () => {
      popup.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        popup.classList.add("hidden");
      }
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("info-popup", InfoPopup);
