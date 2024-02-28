class categoryKeywordForm extends HTMLElement {
  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="flex flex-col items-center container px-8 h-50vh mt-5">
      <form id="category-keyword" class="mb-6 w-full sm:w-[600px] flex flex-row gap-0">
          <div class="flex flex-col w-1/2">
            <label for="category-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
            <input type="text" id="category-input" name="category" class="block w-full p-4 border rounded-l-lg rounded-r-none dark:bg-grey-high dark:border-gray-600 dark:placeholder-gray-400" placeholder="Enter category name">
          </div>
          <div class="flex flex-col w-full">
            <label for="keywords-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keywords</label>
            <input type="text" id="keywords-input" name="keywords" class="block w-full p-4 border rounded-l-none rounded-r-lg bg-gray-50 dark:bg-grey-high dark:border-gray-600 dark:placeholder-gray-400" placeholder="Add relevant keywords">
          </div>
          <button type="submit" class="self-end bg-gray-high hover:bg-green-600 text-black dark:text-white text-3xl py-2 px-2 rounded ml-4 my-1"> + </button>
          </form>
          
        <div id="category-keywords-container">

        </div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.appendChild(this.generateTemplate().content.cloneNode(true));
  }
}

customElements.define("category-keyword-form", categoryKeywordForm);
