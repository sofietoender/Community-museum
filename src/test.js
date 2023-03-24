import "./style.css";

// First we get all the elements we need from the DOM
const listContainer = document.querySelector("#js-list");
const toggleCartBtn = document.querySelector("#js-toggle-cart");
const closeCartBtn = document.querySelector("#js-close-cart");
const cartlistEl = document.querySelector("#js-cart-list");
const totalItemsEl = document.querySelector("#js-cart-total-items");
const totalPriceEl = document.querySelector("#js-cart-total-price");
const cartSectionEl = document.querySelector("#js-cart-section");
const clearCartEl = document.querySelector("#js-clear-cart");
const url = "https://rickandmortyapi.com/api/character";

// We get the cart list from local storage. If it doesn't exist we initialize it as an empty array. This ensures that oru cart works for different pages of our website.
let cartList = JSON.parse(localStorage.getItem("cart_list")) || [];
// We initialize the cart list & characters as an empty array
let characters = [];

// Open and close the cart
toggleCartBtn.addEventListener("click", function () {
  cartSectionEl.classList.toggle("is-open");
});

closeCartBtn.addEventListener("click", function () {
  cartSectionEl.classList.remove("is-open");
});

clearCartEl.addEventListener("click", clearCart);

// Fetch the characters from the API
fetchCharacters();

async function fetchCharacters() {
  try {
    const response = await fetch(url);
    const json = await response.json();

    // Reset the HTML list
    listContainer.innerHTML = "";

    // Reassign the characters array to the API results
    characters = json.results;

    characters.forEach(function (character) {
      listContainer.innerHTML += createCharacterCardHtml(character);
    });

    // Get all the "add to cart" buttons using the data-item attribute
    const buttons = document.querySelectorAll("[data-item]");

    // Reset the cart list html each time we fetch the characters
    cartlistEl.innerHTML = "";

    buttons.forEach(function (button) {
      button.addEventListener("click", () => addToCart(button));
    });

    updateCart();
  } catch (error) {
    console.log(error);
  }
}

// We need to populate the list of items for the cart by using the character ID placed on the "Add to cart" button data attribute. We can use the find method to find the character by ID.
function getCharacterById(id) {
  return characters.find(function (character) {
    return character.id === parseInt(id);
  });
}

// NOTE: We add the character ID to the button data attribute so we can get that in our addToCart function
function createCharacterCardHtml(character) {
  return `
    <div class="c-card">
      <a href="/details.html?id=${character.id}">
          <picture class="c-card_image">
            <img src="${character.image}" loading="lazy">
          </picture>
      </a>

      <div class="c-card_details">
          <h4 class="c-card_name">${character.name}</h4>
          <button data-item="${character.id}">Add to cart</button>                                                                                                                                                        
      </div>
    </div>
  `;
}

function createCartItemHTML(item) {
  return `
    <div class="c-cart-list_item">
      <h4>Name: <strong>${item.name}</strong><h4>
      <p>Price <strong>${item.id}</strong><p>
    </div>
  `;
}

function addToCart(button) {
  // Get the character ID from the button data attribute.
  // @tutorial https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  const id = button.dataset.item;
  const character = getCharacterById(id);

  cartList.push(character);
  localStorage.setItem("cart_list", JSON.stringify(cartList));

  updateCart();
}

function updateCart() {
  cartlistEl.innerHTML = "";

  cartList.forEach(function (item) {
    cartlistEl.innerHTML += createCartItemHTML(item);
  });

  // We update the total items and total price
  totalItemsEl.innerHTML = cartList.length;
  // We use the reduce method to get the total price. It's a special function that accumalates the total price.
  totalPriceEl.innerHTML = cartList.reduce((total, item) => total + item.id, 0);
}

function clearCart() {
  localStorage.removeItem("cart_list");
  cartList = [];
  updateCart();
}
