import { categories } from "../constants.js";
import { html } from "../helpers.js";

class CategoryEl extends HTMLElement {
  categoryId: string;
  categoryName: string;
  currentSelectedQuality: string;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center @md/dropdown:h-20">
        <div
          id="dropdown"
          class="relative flex h-24 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-2.5 py-1.5 text-left text-base shadow-sm @md/dropdown:h-16 @md/dropdown:px-[18px] dark:border-grey-high dark:bg-grey-high"
        >
          <p
            class="grid h-full text-xl @md/dropdown:place-items-center @md/dropdown:text-base"
          >
            ${this.categoryName}
          </p>

          <div
            class="flex h-full flex-col items-end justify-end gap-y-1.5 @md/dropdown:flex-row @md/dropdown:items-center @md/dropdown:justify-normal @md/dropdown:gap-x-4"
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
    // this.setAttribute("data-element", "custom");
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
