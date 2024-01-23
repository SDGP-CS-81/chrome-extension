import { qualities, defaultPreferences } from "../../common/constants.js";
import { getYTVideoCategorisation } from "../../common/htmlParsers.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="dropdown relative text-left">
      <button type="button" class="dropdown-button flex h-14 w-full items-center justify-between rounded-lg bg-secondary_variant px-[18px] text-sm shadow-sm" aria-expanded="false" aria-haspopup="true">
        <span class="quality-text">Quality Options</span>
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>
      <div class="dropdown-menu absolute right-0 top-2 z-10 mt-0 w-36 origin-top-right rounded-md bg-secondary_variant shadow-lg ring-2 ring-lightGrey ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div class="overflow-y-scroll scrollbar-thin scrollbar-thumb-primary" style="height: 310px;" role="none">
        <div class="py-0" role="none">
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
    this.appendChild(generateTemplate().content.cloneNode(true));

    const dropdownButton = this.querySelector(".dropdown-button");
    const dropdownMenu = this.querySelector(".dropdown-menu");
    const dropdownOptionsContainer = this.querySelector(".py-0");

    const updateOptions = () => {
      // remove existing options
      dropdownOptionsContainer.innerHTML = "";

      // add options from the imported qualities array
      qualities.forEach((quality, index) => {
        const menuItem = document.createElement("a");
        menuItem.href = "#";
        menuItem.textContent = `${quality}p`;
        menuItem.classList.add(
          "block",
          "w-full",
          "px-4",
          "py-3",
          "text-sm",
          "text-white",
          "hover:bg-gray-100",
          "hover:text-gray-900"
        );
        menuItem.setAttribute("role", "menuitem");
        menuItem.setAttribute("tabindex", "-1");
        menuItem.id = `menu-item-${index}`;

        menuItem.addEventListener("click", () => {
          // update the selected quality and close the menu
          this.selectedQuality = quality;
          dropdownButton.querySelector(".quality-text").textContent =
            `${quality}p`;
          dropdownMenu.classList.add("hidden");
          dropdownButton.setAttribute("aria-expanded", "false");
        });

        dropdownOptionsContainer.appendChild(menuItem);
      });
    };

    // initially populate options
    updateOptions();

    dropdownButton.addEventListener("click", () => {
      const expanded =
        dropdownButton.getAttribute("aria-expanded") === "true" || false;
      dropdownButton.setAttribute("aria-expanded", !expanded);
      dropdownMenu.classList.toggle("hidden", expanded);
    });

    // close the menu when clicking outside of it
    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        dropdownMenu.classList.add("hidden");
        dropdownButton.setAttribute("aria-expanded", "false");
      }
    });

    this.updateDropdownButtonText();
  }

  updateDropdownButtonText() {
    // get the current video category
    // TO-DO: current category fucntionality...
    const currentCategory = getYTVideoCategorisation();

    // get the preferred quality for a given category
    const preferredQuality =
      this.getPreferredQualityForCategory(currentCategory);

    const dropdownButton = this.querySelector(".dropdown-button");
    dropdownButton.querySelector(".quality-text").textContent =
      `${preferredQuality}`;
  }

  // returns the preferred quality for a given category
  getPreferredQualityForCategory(category) {
    return defaultPreferences.categories[category] || "480p";
  }
}

customElements.define("dropdown-el", Dropdown);
