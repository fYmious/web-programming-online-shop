'use strict'

const ALL_PRODUCTS = [
  new Product("Картошка", 80),
  new Product("Сосиска", 90),
  new Product("Морковка", 100),
  new Product("Апельсин", 180),
  new Product("Сахар", 1080),
];

function Product(name, price) {
  this.name = name;
  this.price = price;

}
Product.prototype.toHtml = function(index) {
  return `<div class="product"> 
    <h2>${this.name}</h2>
    Цена: ${this.price} <br>
    <button class="add-to-cart-btn" onclick="addToCart(${index})">Добавить в корзину</button>
    </div>`;
}

function Cart() { }
Cart.prototype.products = new Map();
Cart.prototype.add = function(product) {
  this.products.set(product, (this.products.get(product) || 0) + 1);
};
Cart.prototype.getAmount = function(product) {
  if (this.products.has(product)) {
    return this.products.get(product);
  }
  return 0;
}
Cart.prototype.hasProduct = function(product) {
  return this.getAmount(product) !== 0;
}
Cart.prototype.getTotalAmount = function() {
  let total = 0;
  for (const [product, amount] of this.products) {
    total += amount;
  }
  return total;
}
Cart.prototype.isEmpty = function() {
  return this.getTotalAmount() === 0;
}
Cart.prototype.clear = function() {
  this.products = new Map();
}
Cart.prototype.toHtml = function() {
  let total = 0;
  let html = `<div>`;

  for (const [product, amount] of this.products) {
    const productTotal = product.price * amount;
    const index = ALL_PRODUCTS.indexOf(product);
    total += productTotal;

    html += `<div class="cart-product"> ${product.name}: 
    ${product.price}$ x ${amount} = ${productTotal}$ <br>
      <button class="remove-from-cart-btn" onclick="removeFromCart(${index})">
        Удалить из корзины
      </button>
      </div>`;
  }

  html += `<br> Итого: ${total}$`;
  html += `</div>`;
  return html;
}
Cart.prototype.remove = function(product) {
  if (this.products.has(product)) {
    this.products.delete(product);
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
  drawCart();
}

function removeFromCart(index) {
  GLOBAL_CART.remove(ALL_PRODUCTS[index]);
  drawCart();
}

let formModal = document.getElementById("form-modal");
let openFormButton = document.getElementById("open-form-btn");

openFormButton.onclick = function() {
  formModal.style.display = "block";
}


window.onclick = function(event) {
  if (event.target == formModal) {
    formModal.style.display = "none";
  }
}

drawProductCards();
drawCart();
