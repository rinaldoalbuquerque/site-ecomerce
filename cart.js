document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");

    // Simulação de produtos
    const products = [
        { id: 1, name: "Liquidificador", price: 149.90, image: "images/liquidificador.jpg" },
        { id: 2, name: "Ferro de Passar", price: 99.90, image: "images/ferro.jpg" },
        { id: 3, name: "Aspirador de Pó", price: 299.90, image: "images/aspirador.jpg" },
        { id: 4, name: "Sanduicheira", price: 89.90, image: "images/sanduicheira.jpg" }
    ];

    // Função para exibir os produtos
    function renderProducts() {
        productList.innerHTML = "";
        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product");
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>R$ ${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            `;
            productList.appendChild(productItem);
        });
    }

    renderProducts();
});

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
});

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = products.find(p => p.id === id);
    
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let totalPrice = 0;
    
    cartContainer.innerHTML = "";
    
    cart.forEach(item => {
        let itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>R$ ${item.price.toFixed(2)}</p>
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
            <button onclick="removeFromCart(${item.id})">Remover</button>
        `;
        cartContainer.appendChild(itemElement);
        
        totalPrice += item.price * item.quantity;
    });
    
    document.getElementById("total-price").innerText = `Total: R$ ${totalPrice.toFixed(2)}`;
}

function updateQuantity(id, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = parseInt(quantity);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
    document.getElementById("checkout-btn").addEventListener("click", checkout);
});

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = products.find(p => p.id === id);
    
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Produto adicionado ao carrinho!");
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let totalPrice = 0;
    
    cartContainer.innerHTML = "";
    
    cart.forEach(item => {
        let itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>R$ ${item.price.toFixed(2)}</p>
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
            <button onclick="removeFromCart(${item.id})">Remover</button>
        `;
        cartContainer.appendChild(itemElement);
        
        totalPrice += item.price * item.quantity;
    });
    
    document.getElementById("total-price").innerText = `Total: R$ ${totalPrice.toFixed(2)}`;
}

function updateQuantity(id, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = parseInt(quantity);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

async function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    let items = cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.price
    }));
    
    let response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer SEU_ACCESS_TOKEN"
        },
        body: JSON.stringify({ items })
    });
    
    let data = await response.json();
    window.location.href = data.init_point;
}
