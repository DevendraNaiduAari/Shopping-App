const menuToggle = document.getElementById('toggle');
const navLinks = document.getElementById('links');
const cartList = document.getElementById('cart-list');
const cartContainer=document.getElementById('cart-container');
const cartCount = document.getElementById('cart-count');
const cartCount1 = document.getElementById('cart-count1');
const totalPrice = document.getElementById('total-price');
const shippingAmount=document.getElementById('shipping-amount');
const finalPrice=document.getElementById('final-price');
const emptyCartMessage = document.getElementById('empty-cart-message');
const orderSummary = document.getElementById('cart-summary');
const itemList = document.querySelector(".item-list");
let cart = [];

const shipping_Amount=30;
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fetch and Display Products
async function getData() {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    displayProducts(data);

    document.getElementById("filter-all").addEventListener("click", () => displayProducts(data));
    document.getElementById("filter-mens").addEventListener("click", () => displayProducts(data.filter(p => p.category === "men's clothing")));
    document.getElementById("filter-womens").addEventListener("click", () => displayProducts(data.filter(p => p.category === "women's clothing")));
    document.getElementById("filter-jewelry").addEventListener("click", () => displayProducts(data.filter(p => p.category === "jewelery")));
    document.getElementById("filter-electronics").addEventListener("click", () => displayProducts(data.filter(p => p.category === "electronics")));
}

function displayProducts(product) {
    const renderData = document.querySelector(".renderData");
    renderData.innerHTML = product.map(products => `
        <div class="product">
            <img src="${products.image}" alt="${products.title}">
            <p class="title-box">${products.title.slice(0, 12)}...</p>
            <p class="discription-box">${products.description.slice(0,90)}...</p>
            <p class="Price-Box">$${products.price}</p>
            <div class="ButtonCart">
                <button class="Details">Details</button>
                <button id="AddToCart" class="add-to-cart" data-id="${products.id}" data-title="${products.title}" data-price="${products.price}" data-image="${products.image}">Add To Cart</button>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}
async function data(){
    const res1 = await fetch("https://fakestoreapi.com/products");
    const data1 = await res1.json();
    displayProducts1(data1);
    
    document.getElementById("filter-all1").addEventListener("click", () => displayProducts1(data1));
    document.getElementById("filter-mens1").addEventListener("click", () => displayProducts1(data1.filter(p => p.category === "men's clothing")));
    document.getElementById("filter-womens1").addEventListener("click", () => displayProducts1(data1.filter(p => p.category === "women's clothing")));
    document.getElementById("filter-jewelry1").addEventListener("click", () => displayProducts1(data1.filter(p => p.category === "jewelery")));
    document.getElementById("filter-electronics1").addEventListener("click", () => displayProducts1(data1.filter(p => p.category === "electronics")));
}
function displayProducts1(product) {
    const renderData1 = document.querySelector(".renderData1");
    renderData1.innerHTML = product.map(products => `
        <div class="product">
            <img src="${products.image}" alt="${products.title}">
            <p class="title-box">${products.title.slice(0, 12)}...</p>
            <p class="discription-box">${products.description.slice(0,90)}...</p>
            <p class="Price-Box">$${products.price}</p>
            <div class="ButtonCart">
                <button class="Details">Details</button>
                <button id="AddToCart" class="add-to-cart" data-id="${products.id}" data-title="${products.title}" data-price="${products.price}" data-image="${products.image}">Add To Cart</button>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}
data();
function addToCart(ele) {
    const id = ele.target.getAttribute('data-id');
    const title = ele.target.getAttribute('data-title');
    const price = parseFloat(ele.target.getAttribute('data-price'));
    const image = ele.target.getAttribute('data-image');
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1, image });
    }

    updateCart();
    saveCartToLocalStorage();
}
function updateCart() {
    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        orderSummary.style.display = "none";
        itemList.style.display = "none";

    } else {
        emptyCartMessage.style.display = "none";
        orderSummary.style.display = "block";
        itemList.style.display = "block";

    }
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-row">
              <img src="${item.image}" alt="${item.title}">
              <p>${item.title}</p>
              <div class="row">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <input type="text" value="${item.quantity}" readonly>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
        </div>
        <div class="cart-row1">
            <p>${item.quantity} x $${(item.price).toFixed(2)}</p>
        </div>
        <hr class="hrs">
    `).join('');


    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    const finalAmount=(parseFloat(totalAmount)+shipping_Amount).toFixed(2);
    cartCount.textContent = totalQuantity;
    cartCount1.textContent=totalQuantity;
    totalPrice.textContent =`$${totalAmount}` ;
    shippingAmount.textContent=`$${shipping_Amount.toFixed(2)}`;
    finalPrice.textContent=`$${finalAmount}`;
    saveCartToLocalStorage();
}
function increaseQuantity(id) {
    const item = cart.find(cartItem => cartItem.id == id);
    if (item) {
        item.quantity += 1;
    }
    updateCart();
}
function decreaseQuantity(id) {
    const item = cart.find(cartItem => cartItem.id == id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
    } else if (item && item.quantity === 1) {
        cart = cart.filter(cartItem => cartItem.id != id);
    }
    updateCart();
}
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart(); 
    }
}
function loadPage() {
    loadCartFromLocalStorage();
    const lastVisitedPage = localStorage.getItem('lastPage');
    if (lastVisitedPage) {
        window[lastVisitedPage]();
    } else {
        home();
    }
}
getData();

let checkoutBtn=document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click',()=>{
    alert("Your Order Is Placed");
});



let abouts=document.querySelector("#about");
let contacts=document.querySelector("#contact");
let homes=document.querySelector("#home");
let products=document.querySelector("#product");
let carts=document.querySelector("#cart");

function home(){
    homes.style.display="block";
    products.style.display="none";
    abouts.style.display="none";
    contacts.style.display="none";
    carts.style.display="none";
}
function product(){
    homes.style.display="none";
    products.style.display="block";
    abouts.style.display="none";
    contacts.style.display="none";
    carts.style.display="none";
}

function about(){
    homes.style.display="none";
    products.style.display="none";
    abouts.style.display="block";
    contacts.style.display="none";
    carts.style.display="none";

}
function contact(){
    homes.style.display="none";
    products.style.display="none";
    abouts.style.display="none";
    contacts.style.display="block";
    carts.style.display="none";
}
function button(){
    homes.style.display="none";
    products.style.display="none";
    abouts.style.display="none";
    contacts.style.display="none";
    carts.style.display="block";
}