'use strict'

const ALL_PRODUCTS = [
  new Product("Яблоко", 1, "media/1.png"),
  new Product("Банан", 2, "media/2.png"),
  new Product("Груша", 1, "media/3.png"),
  new Product("Апельсин", 2, "media/4.png"),
  new Product("Лимон", 1, "media/5.png"),
];

function Product(name, price, imagePath) {
  this.name = name;
  this.price = price;
  this.imagePath = imagePath;
}
Product.prototype.toHtml = function(index) {
  return `<article class="product"> 
    <img class="product-image" alt="${this.name}" src="${this.imagePath}">
    <h2>${this.name}</h2>
    Цена: ${this.price}$ <br>
    <button class="add-to-cart-btn" onclick="addToCart(${index})">Добавить в корзину</button>
    </article>`;
}

function Cart() {
  this.products = new Map();
}

Cart.prototype.add = function(product) {
  this.products.set(product, (this.products.get(product) || 0) + 1);
};

Cart.prototype.getAmount = function(product) {
  if (this.products.has(product)) {
    return this.products.get(product);
  }
  return 0;
}
Cart.prototype.clear = function() {
  this.products = new Map();
}

Cart.prototype.changeAmount = function(product, delta) {
  const currentAmount = this.getAmount(product);
  const newAmount = currentAmount + delta;

  if (newAmount <= 0) {
    this.products.delete(product);
  } else {
    this.products.set(product, newAmount);
  }
}

Cart.prototype.remove = function(product) {
  if (this.products.has(product)) {
    this.products.delete(product);
  }
}

Cart.prototype.toHtml = function() {
  let total = 0;
  let html = `<div>`;

  for (const [product, amount] of this.products) {
    const productTotal = product.price * amount;
    const index = ALL_PRODUCTS.indexOf(product);
    total += productTotal;

    html += `<div class="cart-product"> ${product.name}: ${product.price}$ <br>
      <button class="amount-btn" onclick="changeAmount(${index}, -1)">−</button>
      <span class="amount-value">${amount}</span>
      <button class="amount-btn" onclick="changeAmount(${index}, 1)">+</button>
      = ${productTotal}$ <br>
      <button class="remove-from-cart-btn" onclick="removeFromCart(${index})">
        Удалить из корзины
      </button>
      </div>`;
  }

  html += `<br> Итого: ${total}$`;
  html += `</div>`;
  return html;
}

const CART_STORAGE_KEY = "cart";

function saveCartToStorage() {
  const cartData = [...GLOBAL_CART.products].map(([product, amount]) => {
    return [ALL_PRODUCTS.indexOf(product), amount];
  });
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
}

function loadCartFromStorage() {
  const rawData = localStorage.getItem(CART_STORAGE_KEY);
  if (!rawData) {
    return;
  }

  const cartData = JSON.parse(rawData);
  for (const [productIndex, amount] of cartData) {
    const product = ALL_PRODUCTS[productIndex];
    if (product) {
      GLOBAL_CART.products.set(product, amount);
    }
  }
}

let GLOBAL_CART = new Cart();

let cartElement = document.getElementById("cart");
let productCardsElement = document.getElementById("products")

function drawProductCards() {
  let html = "";
  ALL_PRODUCTS.forEach((product, index) => {
    html += product.toHtml(index);
  });
  productCardsElement.innerHTML = html;
}

function drawCart() {
  cartElement.innerHTML = GLOBAL_CART.toHtml();
}

function addToCart(index) {
  GLOBAL_CART.add(ALL_PRODUCTS[index]);
  saveCartToStorage();
  drawCart();
}

function removeFromCart(index) {
  GLOBAL_CART.remove(ALL_PRODUCTS[index]);
  saveCartToStorage();
  drawCart();
}

function changeAmount(index, delta) {
  GLOBAL_CART.changeAmount(ALL_PRODUCTS[index], delta);
  saveCartToStorage();
  drawCart();
}

let formModal = document.getElementById("form-modal");
let openFormButton = document.getElementById("open-form-btn");
let orderForm = document.querySelector("#form-modal form");
let orderCreatedModal = document.getElementById("order-created-modal")

orderForm.addEventListener("submit", function(event) {
  event.preventDefault();
  formModal.style.display = "none";
  orderCreatedModal.style.display = "block";
  GLOBAL_CART.clear();
  saveCartToStorage();
  drawCart();
});

openFormButton.onclick = function() {
  formModal.style.display = "block";
}

window.onclick = function(event) {
  if (event.target === formModal) {
    formModal.style.display = "none";
  }
  if (event.target === orderCreatedModal) {
    orderCreatedModal.style.display = "none";
  }
}

loadCartFromStorage();
drawProductCards();
drawCart();
