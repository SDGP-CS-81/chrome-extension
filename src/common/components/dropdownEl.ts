import { categoryInfo } from "../../svg.js";
import { setPreferences, getPreferences, html } from "../helpers.js";
import { qualities, categories } from "../constants.js";

class DropdownEl extends HTMLElement {
  categoryId: string;
  categoryName: string;
  currentSelectedQuality: string;

  generateMenuItemTemplate(quality: number, selectedQuality: string) {
    const isSelected = quality.toString() === selectedQuality;
    return html`
      <p
        class="dropdown-menu-item ${isSelected
          ? "bg-primary-dark dark:text-white"
          : "dark:text-white hover:bg-grey-low hover:text-gray-900"} z-[99] block h-12 w-full cursor-pointer px-4 py-3 text-right text-base"
        data-quality="${quality.toString()}"
      >
        ${quality.toString()}p
      </p>
    `;
  }

  generateTemplate() {
    const qualityItemsHtml = qualities
      .map((quality) =>
        this.generateMenuItemTemplate(quality, this.currentSelectedQuality)
      )
      .join("");

    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center @[400px]/dropdown:h-20">
        <div id="dropdown" class="relative w-full text-left">
          <!-- Button to trigger the dropdown -->
          <button
            type="button"
            id="dropdown-button"
            class="flex h-14 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] text-base shadow-sm @[400px]/dropdown:h-16 dark:border-grey-high dark:bg-grey-high"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <!-- Category name -->
            <p>${this.categoryName}</p>
            <!-- Selected quality and dropdown icon -->
            <div class="flex items-center">
              <p id="quality-text" class="mr-2">
                ${this.currentSelectedQuality
                  ? `${this.currentSelectedQuality}p`
                  : ""}
              </p>
              ${categoryInfo}
            </div>
          </button>
          <!-- Dropdown menu -->
          <div
            id="dropdown-item-container"
            class="custom-scroll absolute right-0 top-12 z-50 hidden h-60 w-48 origin-top-right overflow-hidden overflow-y-scroll rounded-md bg-secondary-light shadow-lg ring-1 ring-grey-mid focus-within:block focus:block dark:bg-grey-high"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <!-- Insert quality items HTML here -->
            ${qualityItemsHtml}
          </div>
        </div>
        <info-popup category-id="${this.categoryId}"></info-popup>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.categoryId = this.getAttribute("category-id");
    this.categoryName = categories[this.categoryId].categoryName;
    const preferences = await getPreferences();
    this.currentSelectedQuality = preferences.categories[this.categoryId];
    this.appendChild(this.generateTemplate().content.cloneNode(true));

    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const dropdownButton = this.querySelector("#dropdown-button");
    const dropdownItemContainer = this.querySelector(
      "#dropdown-item-container"
    );

    // handle button clicks to toggle dropdown visibility
    dropdownButton.addEventListener("click", () => {
      const expanded = dropdownButton.getAttribute("aria-expanded") === "true";
      dropdownButton.setAttribute("aria-expanded", (!expanded).toString());
      dropdownItemContainer.classList.toggle("hidden", expanded);
    });

    // global click event listener to hide the dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!this.contains(event.target as HTMLElement)) {
        dropdownItemContainer.classList.add("hidden");
        dropdownButton.setAttribute("aria-expanded", "false");
      }
    });
    // handle dropdown menu item clicks
    dropdownItemContainer.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
      const selectedQuality = target.getAttribute("data-quality");

      const preferences = await getPreferences();
      preferences.categories[this.categoryId] = selectedQuality;
      await setPreferences(preferences);

      // remove the 'bg-primary-dark' class from all items
      this.querySelectorAll(".dropdown-menu-item").forEach((item) => {
        item.classList.remove(
          "bg-primary-dark",
          "dark:text-white",
          "text-black"
        );
        item.classList.add(
          "dark:text-white",
          "text-black",
          "hover:bg-grey-low",
          "hover:text-gray-900"
        );
      });

      // highlight the selected item
      target.classList.add("bg-primary-dark", "dark:text-white", "text-black");
      target.classList.remove(
        "dark:text-white",
        "text-black",
        "hover:bg-grey-low",
        "hover:text-gray-900"
      );

      // hide dropdown after selection
      this.querySelector("#dropdown-button").setAttribute(
        "aria-expanded",
        "false"
      );
      this.querySelector("#dropdown-item-container").classList.add("hidden");

      // update displayed quality
      dropdownButton.querySelector("#quality-text").textContent =
        `${selectedQuality}p`;
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("dropdown-el", DropdownEl);
