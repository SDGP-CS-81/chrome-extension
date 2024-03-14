import { caretDown } from "../../svg.js";
import { getPreferences, html, postChannelInfo } from "../helpers.js";
import { categoriesList } from "../constants.js";

class CategoryDropdownEl extends HTMLElement {
  channelName: string;
  channelId: string;
  channelCategoryId: string;
  channelCategory: string;
  currentSelectedCategory: string;

  generateMenuItemTemplate(channelCategory: string, selectedCategory: string) {
    const isSelected = channelCategory === selectedCategory;
    console.log("is selcted", isSelected);
    return html`
      <p
        class="channel-dropdown-menu-item ${isSelected
          ? "bg-primary-dark dark:text-white"
          : "dark:text-white hover:bg-grey-low hover:text-gray-900"} z-[99] block h-12 w-full cursor-pointer px-4 py-3 text-right text-base"
        data-category="${channelCategory}"
      >
        ${channelCategory}
      </p>
    `;
  }

  generateTemplate() {
    const catgeoryItemsHtml = categoriesList
      .map((category) =>
        this.generateMenuItemTemplate(category, this.currentSelectedCategory)
      )
      .join("");

    console.log("after generating menu template", this.currentSelectedCategory);

    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center @[400px]/channel-dropdown:h-20">
        <div id="channel-dropdown" class="relative w-full text-left">
          <!-- Button to trigger the dropdown -->
          <button
            type="button"
            id="channel-dropdown-button"
            class="flex h-14 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] text-base shadow-sm @[400px]/dropdown:h-16 dark:border-grey-high dark:bg-grey-high"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <!-- Channel Id -->
            <p id="channel-name">${this.channelName}</p>
            <!-- Selected channel category and dropdown icon -->
            <div class="flex items-center">
              <p id="category-text" class="mr-2">
                ${this.currentSelectedCategory
                  ? `${this.currentSelectedCategory}`
                  : ""}
              </p>
              ${caretDown}
            </div>
          </button>
          <!-- Dropdown menu -->
          <div
            id="channel-dropdown-item-container"
            class="custom-scroll absolute right-0 top-12 z-50 hidden h-60 w-48 origin-top-right overflow-hidden overflow-y-scroll overscroll-contain rounded-md bg-secondary-light shadow-lg ring-1 ring-grey-mid focus-within:block focus:block dark:bg-grey-high"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <!-- Insert category items HTML here -->
            ${catgeoryItemsHtml}
          </div>
        </div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.setAttribute("channel-element", "custom");
    this.channelCategoryId = this.getAttribute("channel-category-id");
    this.channelName = this.getAttribute("channel-name");
    this.channelId = this.getAttribute("channel-id");
    console.log("this.channelCategoryId", this.channelCategoryId);

    const preferences = await getPreferences();

    // get current channel name
    console.log("current channel name dropdwon", this.channelName);

    // check if the channel name is already a key of preferneces.channelPreferences
    // if true, assign value of channel name to current selected category
    if (this.channelName in preferences.channelPreferences) {
      // get current category for this channel
      this.currentSelectedCategory =
        preferences.channelPreferences[this.channelName];
      console.log(
        "current selected category dropdwon",
        this.currentSelectedCategory
      );
    }

    this.appendChild(this.generateTemplate().content.cloneNode(true));

    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const dropdownButton = this.querySelector("#channel-dropdown-button");
    const dropdownItemContainer = this.querySelector(
      "#channel-dropdown-item-container"
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
      const selectedCategory = target.getAttribute("data-category");

      postChannelInfo(this.channelId, selectedCategory.toLowerCase())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      // remove the 'bg-primary-dark' class from all items
      this.querySelectorAll(".channel-dropdown-menu-item").forEach((item) => {
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
      this.querySelector("#channel-dropdown-button").setAttribute(
        "aria-expanded",
        "false"
      );
      this.querySelector("#channel-dropdown-item-container").classList.add(
        "hidden"
      );

      // update displayed quality
      dropdownButton.querySelector("#category-text").textContent =
        `${selectedCategory}`;
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("category-dropdown", CategoryDropdownEl);
