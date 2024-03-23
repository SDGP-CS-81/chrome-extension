import { html } from "../helpers.js";
import { getPreferences, setPreferences } from "../helpers.js";

class CustomCategoryInput extends HTMLElement {
  categoryId: string;
  categoryKeywords: string[];

  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex w-full items-center border-t dark:border-secondary-dark">
        <p
          name="category"
          class="flex w-28 flex-col border-r border-grey-low bg-white px-[18px] py-2 dark:border-secondary-dark dark:bg-grey-high dark:shadow-stone-500"
        >
          Keywords
        </p>
        <input
          name="keywords"
          class="flex w-full flex-col bg-gray-100 p-2 outline-grey-low disabled:opacity-70 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
          value="${this.categoryKeywords.join(", ")}"
          placeholder="Add relevant keywords"
        />
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    const preferences = await getPreferences();

    this.categoryId = this.getAttribute("category-id");
    this.categoryKeywords =
      preferences.customCategories[this.categoryId].keywords;

    this.appendChild(this.generateTemplate().content.cloneNode(true));

    const handleChange = async (e: Event) => {
      const preferences = await getPreferences();

      console.log(`CategoryInput: Handling input`);
      const input = e.target as HTMLInputElement;

      preferences.customCategories[this.categoryId].keywords = input.value
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase());
      setPreferences(preferences);
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

customElements.define("custom-category-input", CustomCategoryInput);
