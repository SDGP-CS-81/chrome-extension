import { getCustomCategories, html, setCustomCategories } from "../helpers.js";
import CategoryEl from "./categoryEl.js";

class CustomCategoryEl extends CategoryEl {
  categoryId: string;
  currentSelectedQuality: string;
  isdefaultcategory: boolean;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex">
        <div
          class="flex w-full flex-col overflow-hidden rounded-lg border border-grey-low bg-secondary-light dark:border-grey-high dark:bg-grey-high"
        >
          <div
            id="dropdown"
            class="relative flex h-24 w-full items-center justify-between px-2.5 py-1.5 text-left text-base shadow-sm @md/main:h-16 @md/main:px-[18px]"
          >
            <p
              class="grid h-full text-xl @md/main:place-items-center @md/main:text-base"
            >
              ${this.categoryId}
            </p>

            <div
              class="flex h-full flex-col items-end justify-end gap-y-1.5 @md/main:flex-row @md/main:items-center @md/main:justify-normal @md/main:gap-x-4"
            >
              ${this.isdefaultcategory
                ? "This category already has preferences set &#8593"
                : `
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
              `}
            </div>
          </div>

          <custom-category-input
            category-id="${this.categoryId}"
          ></custom-category-input>
        </div>

        <button
          class="grid w-10 place-items-center rounded text-black dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-6 w-6 fill-none stroke-current stroke-[1.5]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    `;
    return template;
  }
  async connectedCallback() {
    this.categoryId = this.getAttribute("category-id");
    this.isdefaultcategory = this.getAttribute("isdefaultcategory") === "true";
    this.appendChild(this.generateTemplate().content.cloneNode(true));

    const deleteButton = this.querySelector("button");

    deleteButton.addEventListener("click", async () => {
      console.log(`CategoryInput: Removing keyword category`);
      this.remove();
      const customCategories = await getCustomCategories();

      delete customCategories[this.categoryId];
      setCustomCategories(customCategories);
    });
  }
}

customElements.define("custom-category-el", CustomCategoryEl);
