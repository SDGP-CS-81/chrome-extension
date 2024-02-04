import { setPreferences, getPreferences } from "../helpers.js";
import { qualities } from "../constants.js";
import { categories } from "../categories.js";

// template for each dropdown menu item
const generateMenuItemTemplate = (quality, selectedQuality) => {
  const isSelected = quality.toString() === selectedQuality;
  return `
    <p class="dropdown-menu-item cursor-pointer z-[99] block h-12 w-full px-4 py-3 text-base text-right ${
      isSelected
        ? "bg-primary text-white"
        : "text-white hover:bg-lightGrey hover:text-gray-900"
    }" data-quality="${quality}">
      ${quality}p
    </p>
  `;
};

// generate overall template for the dropdown
const generateTemplate = (selectedQuality, category) => {
  const qualityItemsHtml = qualities
    .map((quality) => generateMenuItemTemplate(quality, selectedQuality))
    .join("");

  const template = document.createElement("template");
  template.innerHTML = `
  <div class="flex items-center @[400px]/dropdown:h-20">
  <div class="dropdown relative text-left w-full">
    <!-- Button to trigger the dropdown -->
    <button type="button" category-id="${category}" class="dropdown-button flex h-14 @[400px]/dropdown:h-16 w-full items-center justify-between rounded-lg bg-secondary_variant px-[18px] text-base shadow-sm" aria-expanded="false" aria-haspopup="true">
      <!-- Category name -->
      <p class="category-text">${category.categoryName}</p>
      <!-- Selected quality and dropdown icon -->
      <div class="flex items-center">
        <p class="quality-text mr-2">${
          selectedQuality ? `${selectedQuality}p` : ""
        }</p>
        <svg class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>
    </button>
    <!-- Dropdown menu -->
    <div class="dropdown-menu absolute right-0 top-3 z-[99] mt-0 w-[200px] origin-top-right rounded-md bg-secondary_variant shadow-lg ring-1 ring-grey focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div class="overflow-y-scroll h-60 mt-2 mb-2 scrollbar-thin scrollbar-thumb-grey" role="none">
        <div class="dropdown-item-container z-auto" role="none">
          <!-- Insert quality items HTML here -->
          ${qualityItemsHtml}
        </div>
      </div>
    </div>
  </div>

  <!-- Popover trigger -->
  <div class="hidden relative items-center @[400px]/dropdown:block ml-2">
    <svg class="h-6 w-full cursor-pointer text-white dropdown-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg> 
    <div class="flex absolute z-[10] right-0 top-0 bg-secondary_variant popup hidden w-72 p-2 rounded-md transform translate-x-[300px] -translate-y-[70px] items-center">
      <p class="text-white text-sm">${category.desc}</p>
      <img src="${
        category.decscImg
      }" alt="Category type" class="w-28 h-28 ml-6 rounded-md" />
    </div>
  </div>
</div>
  `;
  return template;
};

class Dropdown extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // initial load
    getPreferences().then(async (preferences) => {
      // console.log("initial preferences", preferences)
      this.currentSelectedQuality =
        preferences.categories[this.getAttribute("category-id")];
      // console.log(this.getAttribute("category-id"), this.currentSelectedQuality)
      this.appendChild(
        generateTemplate(
          this.currentSelectedQuality,
          categories[this.getAttribute("category-id")]
        ).content.cloneNode(true)
      );

      // handle dropdown menu item clicks
      this.querySelector(".dropdown-item-container").addEventListener(
        "click",
        (event) => {
          const selectedQuality = event.target.getAttribute("data-quality");
          // console.log(selectedQuality)
          getPreferences().then(async (object) => {
            const preferences = object.preferences;
            preferences.categories[this.getAttribute("category-id")] =
              selectedQuality;
            await setPreferences(preferences);
            // console.log("set preferences", preferences)
          });

          // remove the 'bg-primary' class from all items
          this.querySelectorAll(".dropdown-menu-item").forEach((item) => {
            item.classList.remove("bg-primary", "text-white");
            item.classList.add(
              "text-white",
              "hover:bg-lightGrey",
              "hover:text-gray-900"
            );
          });

          // highlight the selected item
          event.target.classList.add("bg-primary", "text-white");
          event.target.classList.remove(
            "text-white",
            "hover:bg-lightGrey",
            "hover:text-gray-900"
          );

          // hide dropdown after selection
          this.querySelector(".dropdown-button").setAttribute(
            "aria-expanded",
            "false"
          );
          this.querySelector(".dropdown-menu").classList.add("hidden");

          // update displayed quality
          dropdownButton.querySelector(".quality-text").textContent =
            `${selectedQuality}p`;
        }
      );

      const dropdownButton = this.querySelector(".dropdown-button");
      const dropdownMenu = this.querySelector(".dropdown-menu");

      const infoIcons = this.querySelectorAll(".dropdown-info-icon");
      const popup = this.querySelector(".popup");

      // handle button clicks to toggle dropdown visibility
      dropdownButton.addEventListener("click", () => {
        const expanded =
          dropdownButton.getAttribute("aria-expanded") === "true";
        dropdownButton.setAttribute("aria-expanded", !expanded);
        dropdownMenu.classList.toggle("hidden", expanded);
      });

      // global click event listener to hide the dropdown when clicking outside
      document.addEventListener("click", (event) => {
        if (!this.contains(event.target)) {
          dropdownMenu.classList.add("hidden");
          dropdownButton.setAttribute("aria-expanded", "false");
          popup.classList.add("hidden");
        }
      });

      // handle info icon clicks to toggle popup visibility
      infoIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
          popup.classList.toggle("hidden");
        });
      });
    });
  }

  disconnectedCallback() {
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("dropdown-el", Dropdown);
