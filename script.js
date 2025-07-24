// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {

    // =================== Mobile Nav ===================
    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    if (bar) bar.addEventListener('click', () => nav.classList.add('active'));
    if (close) close.addEventListener('click', () => nav.classList.remove('active'));

    // =================== Cart ===================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartCount);
    }

    function addToCart(product) {
        const existing = cart.find(item => item.name === product.name && item.size === product.size);
        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        saveCart();
        updateCartCount();
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productEl = button.closest('.pro');
            const name = productEl.querySelector('.des h5')?.innerText;
            const price = parseFloat(productEl.querySelector('.des h4')?.innerText.replace('$', ''));
            const image = productEl.querySelector('img')?.src;
            const sizeSelect = productEl.querySelector('.size-select-shop');
            const size = sizeSelect?.value;

            if (!size || size === 'Select Size') {
                alert('Please select a size before adding to cart.');
                return;
            }

            addToCart({ name, price, image, size, quantity: 1 });
            alert(`${name} (Size: ${size}) added to cart.`);
        });
    });

    // =================== Product Click Redirect ===================
    document.querySelectorAll('.pro').forEach(product => {
        const img = product.querySelector('img');
        const des = product.querySelector('.des');
        const name = des.querySelector('h5')?.innerText;
        const price = parseFloat(des.querySelector('h4')?.innerText.replace('$', ''));
        const image = img?.src;

        const goToProduct = () => {
            const url = `sproduct.html?image=${encodeURIComponent(image)}&name=${encodeURIComponent(name)}&price=${price}`;
            window.location.href = url;
        };

        img.addEventListener('click', goToProduct);
        des.addEventListener('click', goToProduct);
    });

    // =================== Cart Table (cart.html) ===================
    function populateCartTable() {
        const cartTable = document.querySelector('#cart tbody');
        if (!cartTable) return;

        cartTable.innerHTML = '';
        if (cart.length === 0) {
            cartTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">Your cart is empty.</td></tr>`;
        } else {
            cart.forEach((item, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="#" class="remove" data-index="${i}"><i class="far fa-times-circle"></i></a></td>
                    <td><img src="${item.image}" alt="${item.name}" style="width: 70px;"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.size}</td>
                    <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${i}"></td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                `;
                cartTable.appendChild(row);
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalElement = document.getElementById('cart-total');
        const totalFinalElement = document.getElementById('cart-total-final');
        if (totalElement) totalElement.textContent = total.toFixed(2);
        if (totalFinalElement) totalFinalElement.textContent = total.toFixed(2);

        // Remove items
        document.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const index = btn.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                populateCartTable();
            });
        });

        // Update quantity
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', e => {
                const index = input.getAttribute('data-index');
                const qty = parseInt(input.value);
                if (qty < 1) return input.value = 1;
                cart[index].quantity = qty;
                saveCart();
                populateCartTable();
            });
        });
    }

    populateCartTable();
    updateCartCount();

    // =================== Login/Logout ===================
    const loginPopup = document.getElementById("login-popup");
    const loginIcon = document.getElementById("login-icon");
    const mobileLoginIcon = document.getElementById("mobile-login-icon");
    const logoutIcon = document.getElementById("logout-icon");
    const closePopup = document.querySelector(".close-popup");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginError = document.getElementById("login-error");
    const registerError = document.getElementById("register-error");
    const registerLink = document.getElementById("register-link");

    function showLoginForm() {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        document.querySelectorAll("#popup-title")[0].textContent = "Login";
        document.querySelectorAll("#popup-title")[0].style.display = "block";
        document.querySelectorAll("#popup-title")[1].style.display = "none";
    }

    function showRegisterForm() {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        document.querySelectorAll("#popup-title")[1].textContent = "Register now";
        document.querySelectorAll("#popup-title")[0].style.display = "none";
        document.querySelectorAll("#popup-title")[1].style.display = "block";
    }

    if (loginIcon) loginIcon.addEventListener("click", e => { e.preventDefault(); loginPopup.style.display = "flex"; showLoginForm(); });
    if (mobileLoginIcon) mobileLoginIcon.addEventListener("click", e => { e.preventDefault(); loginPopup.style.display = "flex"; showLoginForm(); });
    if (closePopup) closePopup.addEventListener("click", () => { loginPopup.style.display = "none"; });

    if (registerLink) registerLink.addEventListener("click", e => { e.preventDefault(); showRegisterForm(); });

    function updateLoginUI() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (loginIcon) loginIcon.style.display = isLoggedIn ? "none" : "inline-block";
        if (logoutIcon) logoutIcon.style.display = isLoggedIn ? "inline-block" : "none";
        if (mobileLoginIcon) mobileLoginIcon.style.display = isLoggedIn ? "none" : "inline-block";
    }

    updateLoginUI();

    if (loginForm) {
        loginForm.addEventListener("submit", () => {
            localStorage.setItem("isLoggedIn", "true");
            updateLoginUI();
        });
    }

    if (logoutIcon) {
        logoutIcon.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            updateLoginUI();
            alert("You have been logged out.");
        });
    }

});
