import { categories } from "../constants.js";
import { getPreferences, setPreferences, html } from "../helpers.js";

class CategoryKeywordForm extends HTMLElement {
  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex flex-col gap-y-6 text-base">
        <form class="flex gap-x-0.5">
          <input
            name="category"
            class="flex w-full max-w-40 flex-col rounded-l-lg rounded-r-none bg-white p-4 outline outline-1 outline-grey-low disabled:opacity-70 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
            placeholder="Category name"
            maxlength="15"
          />
          <input
            name="keywords"
            class="flex w-full flex-col rounded-l-none rounded-r-lg bg-white p-4 outline outline-1 outline-grey-low disabled:opacity-70 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
            placeholder="Add relevant keywords"
            disabled
          />
          <button type="submit" class="grid w-10 place-items-center">
            <span class="text-3xl text-black dark:text-white">+</span>
          </button>
        </form>
        <div
          id="category-keywords-container"
          class="flex flex-col gap-y-6"
        ></div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    await this.setUpEventListeners();
    await this.loadDataFromLocalStorage();
  }

  async setUpEventListeners() {
    const form = this.querySelector("form");
    const categoryInput = this.querySelector(
      '[name="category"]'
    ) as HTMLInputElement;
    const keywordsInput = this.querySelector(
      '[name="keywords"]'
    ) as HTMLInputElement;

    categoryInput.addEventListener("input", () => {
      if (categoryInput.value.trim()) {
        keywordsInput.disabled = false;
      } else {
        keywordsInput.disabled = true;
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log(`CategoryKeywordForm: Preparing to submit categories`);

      const formData = new FormData(e.target as HTMLFormElement);
      const categoryData = (formData.get("category") as string).toLowerCase();
      const keywords = formData.get("keywords") as string;

      console.log(`CategoryKeywordForm: New category: ${categoryData}`);
      console.log(`CategoryKeywordForm: Keywords: ${keywords}`);

      if (!keywords) return;

      const keywordData = keywords
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase());

      // Get the existing data from chrome storage
      const preferences = await getPreferences();

      // If the category already exists, append the new keywords
      if (preferences.customCategories[categoryData]) {
        console.log(
          `CategoryKeywordForm: Category exists, appending new keywords`
        );
        preferences.customCategories[categoryData].keywords = [
          ...new Set([
            ...preferences.customCategories[categoryData].keywords,
            ...keywordData,
          ]),
        ];
      } else {
        console.log(
          `CategoryKeywordForm: Creating category and adding keywords`
        );
        preferences.customCategories[categoryData] = {
          min: "144",
          max: "144",
          audioOnly: false,
          keywords: keywordData,
        };
      }

      await setPreferences(preferences);

      console.log(`CategoryKeywordForm: Resetting form back to default`);
      (e.target as HTMLFormElement).reset();
      (this.querySelector('[name="keywords"]') as HTMLInputElement).disabled =
        true;

      // Clear the current display and load the updated data from chrome storage
      this.querySelector("#category-keywords-container").innerHTML = "";
      this.loadDataFromLocalStorage();
    });
  }

  async loadDataFromLocalStorage() {
    console.log(
      `CategoryKeywordForm: Loading category keyword data from local storage`
    );
    const categoryKeywordsContainer = this.querySelector(
      "#category-keywords-container"
    );

    const preferences = await getPreferences();
    for (const categoryData in preferences.customCategories) {
      const newRow = document.createElement("custom-category-el");
      newRow.setAttribute("category-id", categoryData);

      Object.entries(categories).forEach(([categoryId]) => {
        if (categoryData === categoryId) {
          newRow.setAttribute("isdefaultcategory", "true");
        }
      });
      categoryKeywordsContainer.prepend(newRow);
    }
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-keyword-form", CategoryKeywordForm);
