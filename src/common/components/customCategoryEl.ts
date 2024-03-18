import { html } from "../helpers.js";
import CategoryEl from "./categoryEl.js";

class CustomCategoryEl extends CategoryEl {
  categoryId: string;
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
            ${this.categoryId}
          </p>

          <div
            class="flex h-full flex-col items-end justify-end gap-y-1.5 @md/dropdown:flex-row @md/dropdown:items-center @md/dropdown:justify-normal @md/dropdown:gap-x-4"
          >
            <custom-category-dropdown
              category-id="${this.categoryId}"
              type="min"
            ></custom-category-dropdown>
            <custom-category-dropdown
              category-id="${this.categoryId}"
              type="max"
            ></custom-category-dropdown>
            <div class="flex w-20 items-center justify-end">
              <custom-audio-toggle
                toggle-id="${this.categoryId}"
              ></custom-audio-toggle>
            </div>
          </div>
        </div>
      </div>
    `;
    return template;
  }
  async connectedCallback() {
    this.categoryId = this.getAttribute("category-id");
    this.appendChild(this.generateTemplate().content.cloneNode(true));
  }
}

customElements.define("custom-category-el", CustomCategoryEl);
