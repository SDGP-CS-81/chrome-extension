import { categories } from "../constants.js";
import { html } from "../helpers.js";

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
          class="relative flex h-14 w-full flex-col justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] text-left text-base shadow-sm @[400px]/dropdown:h-16 @[400px]/dropdown:flex-row @[400px]/dropdown:items-center dark:border-grey-high dark:bg-grey-high"
        >
          <p>${this.categoryName}</p>

          <div
            class="flex w-full items-center justify-between gap-x-8 @[400px]/dropdown:w-auto @[400px]/dropdown:justify-normal"
          >
            <dropdown-el
              ${this.categoryId === "defaultQuality" ? "hidden" : ""}
              category-id="${this.categoryId}"
              type="min"
            ></dropdown-el>
            <dropdown-el
              category-id="${this.categoryId}"
              type="max"
            ></dropdown-el>
            <div class="flex w-20 items-center justify-end">
              <audio-toggle toggle-id="${this.categoryId}"></audio-toggle>
            </div>
          </div>
        </div>

        <info-popup category-id="${this.categoryId}"></info-popup>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.categoryId = this.getAttribute("category-id");
    this.categoryName = categories[this.categoryId].categoryName;
    this.appendChild(this.generateTemplate().content.cloneNode(true));
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-el", CategoryEl);
