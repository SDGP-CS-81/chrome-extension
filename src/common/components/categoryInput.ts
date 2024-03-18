import { html } from "../helpers.js";
import { getCustomCategories, setCustomCategories } from "../helpers.js";

class CategoryInput extends HTMLElement {
  categoryId: string;
  categoryKeywords: string[];

  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center">
        <div class="flex w-full gap-x-0.5">
          <div
            name="category"
            class="flex w-full max-w-36 flex-col rounded-l-lg rounded-r-none bg-gray-100 p-4 outline outline-1 outline-grey-low disabled:opacity-70 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
          >
            ${this.categoryId}
          </div>
          <input
            name="keywords"
            class="flex w-full flex-col rounded-l-none rounded-r-lg bg-gray-100 p-4 outline outline-1 outline-grey-low disabled:opacity-70 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
            value="${this.categoryKeywords.join(", ")}"
            placeholder="Add relevant keywords"
          />
        </div>

        <custom-category-dropdown
          category-id="${this.categoryId}"
          type="max"
        ></custom-category-dropdown>
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
    const customCategories = await getCustomCategories();

    this.categoryId = this.getAttribute("category-id");
    this.categoryKeywords = customCategories[this.categoryId].keywords;

    this.appendChild(this.generateTemplate().content.cloneNode(true));

    const deleteButton = this.querySelector("button");
    deleteButton.addEventListener("click", async () => {
      console.log(`CategoryInput: Removing keyword category`);
      this.remove();
      const customCategories = await getCustomCategories();

      delete customCategories[this.categoryId];
      setCustomCategories(customCategories);
    });

    const handleChange = async (e: Event) => {
      console.log(`CategoryInput: Handling input`);
      const customCategories = await getCustomCategories();
      const input = e.target as HTMLInputElement;

      customCategories[this.categoryId].keywords = input.value
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase());
      setCustomCategories(customCategories);
    };
    this.querySelector('[name="keywords"]').addEventListener(
      "input",
      handleChange
    );
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-input", CategoryInput);
