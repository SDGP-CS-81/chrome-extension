import { Category, categories } from "../constants.js";
import { html } from "../helpers.js";

class InfoPopup extends HTMLElement {
  categoryId: string;
  generateTemplate(category: Category) {
    const template = document.createElement("template");
    template.innerHTML = html` <div
      class="relative ml-2 hidden items-center @md/dropdown:block"
    >
      <svg
        id="dropdown-info-icon"
        class="h-6 w-full cursor-pointer fill-none stroke-current dark:text-white"
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
        id="popup"
        class="absolute right-7 z-10 hidden w-60 transform flex-col items-center rounded-md bg-secondary-light shadow-2xl dark:bg-grey-high dark:shadow-stone-700"
      >
        <div
          style="background-image: url(${category.descImg});"
          alt="Category
          type"
          class="aspect-video w-full rounded-t-md bg-cover bg-center bg-no-repeat"
        ></div>
        <p class="px-4 py-3 text-sm text-black dark:text-white">
          ${category.desc}
        </p>
      </div>
    </div>`;
    return template;
  }

  connectedCallback() {
    this.categoryId = this.getAttribute("category-id");

    this.appendChild(
      this.generateTemplate(categories[this.categoryId]).content.cloneNode(true)
    );

    const infoIcon = this.querySelector("#dropdown-info-icon");
    const popup = this.querySelector("#popup");

    infoIcon.addEventListener("click", () => {
      popup.classList.toggle("hidden");
      popup.classList.toggle("flex");
    });

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target as Node)) {
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
