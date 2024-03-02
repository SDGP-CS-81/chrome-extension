import { html } from "../helpers.js";
import { getCustomCategories, setCustomCategories } from "./categoryForm.js";

class CategoryInput extends HTMLElement {
  categoryId: string;
  categoryKeywords: string[];

  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="mb-6 flex w-full flex-row gap-0">
        <input
          class="flex w-1/2 flex-col rounded-l-lg rounded-r-none border border-grey-low p-4 dark:border-gray-600 dark:bg-grey-high"
          value="${this.categoryId}"
        />
        <input
          class="flex w-full flex-col rounded-l-none rounded-r-lg border border-grey-low bg-gray-50 p-4 dark:border-gray-600 dark:bg-grey-high"
          value="${this.categoryKeywords.join(", ")}"
        />
        <button
          class="mb-2 mr-2 self-end rounded py-2 pl-3 pr-1 text-lg text-black dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
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
    const customCategories = await getCustomCategories();
    this.categoryKeywords = customCategories[this.categoryId];

    this.appendChild(this.generateTemplate().content.cloneNode(true));

    const deleteButton = this.querySelector("button");
    deleteButton.addEventListener("click", async () => {
      this.remove();
      // Remove the category from chrome storage
      const customCategories = await getCustomCategories();

      delete customCategories[this.categoryId];
      setCustomCategories(customCategories);
      console.log("Category " + this.categoryId + " is removed from storage.");
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-input", CategoryInput);
