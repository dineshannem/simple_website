let currentUser = null;

// PRODUCTS
const products = [
    {id:1,name:"Phone",price:200,image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&q=50"},
    {id:2,name:"Laptop",price:800,image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&q=50"},
   {id:4,name:"Watch",price:120,image:"https://images.unsplash.com/photo-1519741497674-611481863552?w=150&q=50"},
    {id:6,name:"Keyboard",price:40,image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&q=50"},
    {id:7,name:"Mouse",price:25,image:"https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=150&q=50"},
    {id:8,name:"Tablet",price:300,image:"https://images.unsplash.com/photo-1542751110-97427bbecf20?w=150&q=50"},
    {id:9,name:"Speaker",price:60,image:"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=150&q=50"},
    {id:10,name:"Monitor",price:150,image:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&q=50"},
    {id:11,name:"Printer",price:180,image:"https://images.unsplash.com/photo-1580894908361-967195033215?w=150&q=50"},
    {id:12,name:"Router",price:70,image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&q=50"},
    {id:14,name:"Hard Disk",price:110,image:"https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&q=50"},
    {id:15,name:"Microphone",price:85,image:"https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&q=50"},
    {id:17,name:"Power Bank",price:45,image:"https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=150&q=50"},
    {id:18,name:"Smart TV",price:600,image:"https://images.unsplash.com/photo-1593784991095-a205069470b6?w=150&q=50"},
    {id:19,name:"Drone",price:900,image:"https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=150&q=50"},
    {id:20,name:"VR Headset",price:350,image:"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=150&q=50"}
];
container.innerHTML += `
    <div class="product">
        <img src="${p.image}" width="100">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${index})">Add</button>
    </div>
`;

// LOAD PRODUCTS
function loadProducts() {
    let container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach((p, index) => {
        container.innerHTML += `
            <div class="product">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <button onclick="addToCart(${index})">Add</button>
            </div>
        `;
    });
}

// REGISTER
function register() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;

    if (!u || !p) {
        alert("Enter all fields");
        return;
    }

    fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: u, password: p })
    })
    .then(res => res.json())
    .then(data => alert(data.msg))
    .catch(() => alert("Server error"));
}

// LOGIN
function login() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;

    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: u, password: p })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentUser = u;

            // ✅ SET WELCOME TEXT
            document.getElementById("welcomeText").innerText = "Welcome, " + currentUser;

            alert("Login Success");
            showPage("productsPage");
        } else {
            alert("Invalid credentials");
        }
    });
}

// ADD TO CART
function addToCart(index) {
    if (!currentUser) {
        alert("Login first");
        return;
    }

    fetch("/add-to-cart", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: currentUser, product: products[index] })
    })
    .then(() => alert("Added to cart"));
}

// VIEW CART
function viewCart() {
    fetch("/get-cart", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: currentUser })
    })
    .then(res => res.json())
    .then(data => {
        let cartDiv = document.getElementById("cart");
        cartDiv.innerHTML = "";

        let total = 0;

        data.cart.forEach(item => {
            total += item.price;
            cartDiv.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
        });

        cartDiv.innerHTML += `<h3>Total: ₹${total}</h3>`;
    });
}

// PAGE SWITCH
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    // KEEP WELCOME TEXT
    if (currentUser) {
        document.getElementById("welcomeText").innerText = "Welcome, " + currentUser;
    }

    if (id === "productsPage") loadProducts();
    if (id === "cartPage") viewCart();
}