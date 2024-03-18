import { getCustomCategories, setCustomCategories } from "../helpers.js";
import DropdownEl from "./dropdownEl.js";

class CustomCategoryDropdown extends DropdownEl {
  categoryId: string;
  currentSelectedQuality: string;
  type: "min" | "max";

  // generateMenuItemTemplate(quality: string, selectedQuality: string) {
  //   const isSelected = quality === selectedQuality;
  //   return html`
  //     <p
  //       class="dropdown-menu-item ${isSelected
  //         ? "bg-primary-dark dark:text-white"
  //         : "dark:text-white hover:bg-grey-low hover:text-gray-900"} z-[99] block h-12 w-full cursor-pointer px-4 py-3 text-right text-base"
  //       data-quality="${quality}"
  //     >
  //       ${quality}p
  //     </p>
  //   `;
  // }

  // generateTemplate() {
  //   const qualityItemsHtml = qualities
  //     .map((quality) =>
  //       this.generateMenuItemTemplate(
  //         quality.toString(),
  //         this.currentSelectedQuality
  //       )
  //     )
  //     .join("");

  //   const template = document.createElement("template");
  //   template.innerHTML = html`
  //     <div id="dropdown" class="relative flex items-center font-azeretmono">
  //       <p class="mr-1 font-dmsans text-sm text-grey-low @md/dropdown:hidden">
  //         ${this.type}
  //       </p>

  //       <!-- Button to trigger the dropdown -->
  //       <button
  //         type="button"
  //         class="flex w-[72px] items-center justify-end @md/dropdown:w-24"
  //         id="dropdown-button"
  //         aria-expanded="false"
  //         aria-haspopup="true"
  //       >
  //         <!-- Selected quality and dropdown icon -->
  //         <p
  //           id="quality-text"
  //           class="mr-px text-sm @md/dropdown:mr-2 @md/dropdown:text-base"
  //         >
  //           ${this.currentSelectedQuality
  //             ? `${this.currentSelectedQuality}p`
  //             : ""}
  //         </p>
  //         ${caretDown}
  //       </button>

  //       <!-- Dropdown menu -->
  //       <div
  //         id="dropdown-item-container"
  //         class="custom-scroll absolute right-0 top-8 z-50 hidden h-60 w-24 origin-top-right overflow-hidden overflow-y-scroll overscroll-contain rounded-md bg-secondary-light shadow-lg ring-1 ring-grey-mid focus-within:block focus:block @md/dropdown:w-48 dark:bg-grey-high"
  //         role="menu"
  //         aria-orientation="vertical"
  //         aria-labelledby="menu-button"
  //       >
  //         <!-- Insert quality items HTML here -->
  //         ${qualityItemsHtml}
  //       </div>
  //     </div>
  //   `;
  //   return template;
  // }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.categoryId = this.getAttribute("category-id");
    this.type = this.getAttribute("type") as typeof this.type;
    const customCategories = await getCustomCategories();
    this.currentSelectedQuality = customCategories[this.categoryId][this.type];
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
      // hide dropdown after selection
      this.querySelector("#dropdown-button").setAttribute(
        "aria-expanded",
        "false"
      );
      this.querySelector("#dropdown-item-container").classList.add("hidden");

      const target = event.target as HTMLElement;
      const selectedQuality = target.getAttribute("data-quality");

      console.log(`DropdownEl: Quality selected, quality: ${selectedQuality}`);

      const customCategories = await getCustomCategories();
      const category = customCategories[this.categoryId];

      // max cannot be greater than min, and min cannot be greater than max
      if (
        (this.type === "max" &&
          parseInt(selectedQuality) < parseInt(category["min"])) ||
        (this.type === "min" &&
          parseInt(selectedQuality) > parseInt(category["max"]))
      ) {
        console.error(
          `DropdownEl: Quality range rule (min <= x <= max) broken`
        );
        return;
      }

      customCategories[this.categoryId][this.type] = selectedQuality;
      await setCustomCategories(customCategories);

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

customElements.define("custom-category-dropdown", CustomCategoryDropdown);
