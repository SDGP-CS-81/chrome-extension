class InputBar extends HTMLElement {
  constructor() {
    super();
    this.tagCount = 0;
    this.inputElement = null;
  }

  setInput(inputElement) {
    this.inputElement = inputElement;
    this.setUpEventListeners();
  }


  addToInputBar(value) {
    const ul = this.querySelector("ul");
    const li = document.createElement("li");
    const inputTag = document.createElement("input-tag");
    inputTag.text = value;
    li.appendChild(inputTag);
    ul.appendChild(li);
  

    this.tagCount++;
  
    if (this.tagCount >= 7) {
      console.log("Maximum number of tags added");
      this.dispatchEvent(new CustomEvent('tag-limit-reached')); // Emit custom event
    }
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <ul class="flex flex-wrap justify-center gap-2 items-center">
      </ul>
    `;
    return template;
  }


  async connectedCallback() {
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    // Only set up event listeners if inputElement is already set
    if (this.inputElement) {
      this.setUpEventListeners();
    }
  }

  setUpEventListeners() {
     // Ensure that the input element is not null
     if (!this.inputElement) {
      console.error('Input element is not set.');
      return;
    }


    this.inputElement.addEventListener("keydown", (event) => {

      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        const value = this.inputElement.value.trim();
        if (value) {
          console.log("Entered " + value);
          this.addToInputBar(value);
          this.inputElement.value = "";
        }
      }
    });
  
    this.addEventListener('tag-removed', () => {
      this.tagCount--;
      if (this.tagCount < 7) {
        this.inputElement.disabled = false; 
        this.inputElement.placeholder = "Add relevant keywords"; 
      }
    });
  }
  

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("input-bar", InputBar);
