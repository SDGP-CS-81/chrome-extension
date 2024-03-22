import { categories } from "../constants.js";
import { html } from "../helpers.js";

class CategoryEl extends HTMLElement {
  categoryId: string;
  categoryName: string;
  currentSelectedQuality: string;
  disabled: boolean;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="relative flex items-center @md/main:h-20">
        ${this.disabled
          ? `
      <!-- placeholder -->
      <div
        class="absolute z-10 grid h-full w-full place-items-center rounded-lg bg-secondary-light text-lg dark:bg-grey-high"
      >
        No Category detected
      </div>`
          : ""}
        <div
          id="dropdown"
          class="relative flex h-24 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-2.5 py-1.5 text-left text-base shadow-sm @md/main:h-16 @md/main:px-[18px] dark:border-grey-high dark:bg-grey-high"
        >
          <p
            class="grid h-full text-xl @md/main:place-items-center @md/main:text-base"
          >
            ${this.categoryName}
          </p>

          <div
            class="flex h-full flex-col items-end justify-end gap-y-1.5 @md/main:flex-row @md/main:items-center @md/main:justify-normal @md/main:gap-x-4"
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
    this.disabled = this.getAttribute("disabled") === "true";
    this.appendChild(this.generateTemplate().content.cloneNode(true));
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-el", CategoryEl);

export default CategoryEl;
