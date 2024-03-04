import { categories } from "../constants.js";
import { getPreferences, html } from "../helpers.js";

class CategoryEl extends HTMLElement {
  categoryId: string;
  categoryName: string;
  currentSelectedQuality: string;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center @[400px]/dropdown:h-20">
        <div
          id="dropdown"
          class="relative flex h-14 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] text-left text-base shadow-sm @[400px]/dropdown:h-16 dark:border-grey-high dark:bg-grey-high"
        >
          <p>${this.categoryName}</p>

          <div class="flex gap-x-10">
            <dropdown-el category-id="${this.categoryId}"></dropdown-el>
            <dropdown-el category-id="${this.categoryId}"></dropdown-el>
          </div>
        </div>

        <info-popup category-id="${this.categoryId}"></info-popup>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    // this.setAttribute("data-element", "custom");
    this.categoryId = this.getAttribute("category-id");
    this.categoryName = categories[this.categoryId].categoryName;
    const preferences = await getPreferences();
    this.currentSelectedQuality = preferences.categories[this.categoryId];
    this.appendChild(this.generateTemplate().content.cloneNode(true));
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-el", CategoryEl);
