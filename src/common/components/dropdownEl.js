import { setPreferences, getPreferences, html } from "../helpers.js";
import { qualities, categories } from "../constants.js";

class DropdownEl extends HTMLElement {
  generateMenuItemTemplate(quality, selectedQuality) {
    const isSelected = quality.toString() === selectedQuality;
    return html`
      <p
        class="dropdown-menu-item ${isSelected
          ? "bg-primary-dark dark:text-white"
          : "dark:text-white hover:bg-grey-low hover:text-gray-900"} z-[99] block h-12 w-full cursor-pointer px-4 py-3 text-right text-base"
        data-quality="${quality}"
      >
        ${quality}p
      </p>
    `;
  }

  generateTemplate(selectedQuality, category) {
    const qualityItemsHtml = qualities
      .map((quality) => this.generateMenuItemTemplate(quality, selectedQuality))
      .join("");

    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center @[400px]/dropdown:h-20">
        <div class="dropdown relative w-full text-left">
          <!-- Button to trigger the dropdown -->
          <button
            type="button"
            class="dropdown-button flex h-14 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] text-base shadow-sm @[400px]/dropdown:h-16 dark:border-grey-high dark:bg-grey-high"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <!-- Category name -->
            <p class="category-text">${category.categoryName}</p>
            <!-- Selected quality and dropdown icon -->
            <div class="flex items-center">
              <p class="quality-text mr-2">
                ${selectedQuality ? `${selectedQuality}p` : ""}
              </p>
              <svg
                class="h-6 w-6 dark:text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>
          <!-- Dropdown menu -->
          <div
            class="custom-scroll dropdown-item-container absolute right-0 top-12 z-50 hidden h-60 w-48 origin-top-right overflow-hidden overflow-y-scroll rounded-md bg-secondary-light shadow-lg ring-1 ring-grey-mid focus-within:block focus:block dark:bg-grey-high"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <!-- Insert quality items HTML here -->
            ${qualityItemsHtml}
          </div>
        </div>

        <!-- Popover trigger -->
        <div class="relative ml-2 hidden items-center @[400px]/dropdown:block">
          <svg
            class="dropdown-info-icon h-6 w-full cursor-pointer stroke-current dark:text-white"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div
            class="popup absolute right-0 top-0 z-[10] flex hidden w-72 -translate-y-[70px] translate-x-[300px] transform items-center rounded-md border border-grey-low bg-secondary-light p-2 dark:border-grey-high dark:bg-grey-high"
          >
            <p class="text-sm text-black dark:text-white">${category.desc}</p>
            <img
              src="${category.decscImg}"
              alt="Category type"
              class="ml-6 h-28 w-28 rounded-md"
            />
          </div>
        </div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.categoryId = this.getAttribute("category-id");

    const preferences = await getPreferences();
    this.currentSelectedQuality = preferences.categories[this.categoryId];
    this.appendChild(
      this.generateTemplate(
        this.currentSelectedQuality,
        categories[this.categoryId]
      ).content.cloneNode(true)
    );

    this.setUpEventListeners();
  }

  setUpEventListeners() {
    // handle dropdown menu item clicks
    this.querySelector(".dropdown-item-container").addEventListener(
      "click",
      async (event) => {
        const selectedQuality = event.target.getAttribute("data-quality");

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
        event.target.classList.add(
          "bg-primary-dark",
          "dark:text-white",
          "text-black"
        );
        event.target.classList.remove(
          "dark:text-white",
          "text-black",
          "hover:bg-grey-low",
          "hover:text-gray-900"
        );

        // hide dropdown after selection
        this.querySelector(".dropdown-button").setAttribute(
          "aria-expanded",
          "false"
        );
        this.querySelector(".dropdown-item-container").classList.add("hidden");

        // update displayed quality
        dropdownButton.querySelector(".quality-text").textContent =
          `${selectedQuality}p`;
      }
    );

    const dropdownButton = this.querySelector(".dropdown-button");
    const dropdownItemContainer = this.querySelector(
      ".dropdown-item-container"
    );

    const infoIcons = this.querySelector(".dropdown-info-icon");
    const popup = this.querySelector(".popup");

    // handle button clicks to toggle dropdown visibility
    dropdownButton.addEventListener("click", () => {
      const expanded = dropdownButton.getAttribute("aria-expanded") === "true";
      dropdownButton.setAttribute("aria-expanded", !expanded);
      dropdownItemContainer.classList.toggle("hidden", expanded);
    });

    // global click event listener to hide the dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        dropdownItemContainer.classList.add("hidden");
        dropdownButton.setAttribute("aria-expanded", "false");
        popup.classList.add("hidden");
      }
    });

    // handle info icon clicks to toggle popup visibility
    infoIcons.addEventListener("click", () => {
      popup.classList.toggle("hidden");
    });
  }
  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("dropdown-el", DropdownEl);
