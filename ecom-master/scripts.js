// Global cart array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedDiscount = 0;

// Update cart quantity on product page (For increasing/decreasing quantity)
const quantityControls = document.querySelectorAll('.quantity-controls');
quantityControls.forEach(control => {
    const increaseBtn = control.querySelector('.increase');
    const decreaseBtn = control.querySelector('.decrease');
    const quantitySpan = control.querySelector('.quantity');

    increaseBtn.addEventListener('click', () => {
        const productName = increaseBtn.getAttribute('data-name');
        const productPrice = parseInt(increaseBtn.getAttribute('data-price'));
        updateCart(productName, productPrice, 1);
        updateQuantityDisplay();
    });

    decreaseBtn.addEventListener('click', () => {
        const productName = decreaseBtn.getAttribute('data-name');
        const productPrice = parseInt(decreaseBtn.getAttribute('data-price'));
        updateCart(productName, productPrice, -1);
        updateQuantityDisplay();
    });
});

// Function to update the quantity display on the page
function updateQuantityDisplay() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productName = card.querySelector('.quantity-controls .increase').getAttribute('data-name');
        const product = cart.find(item => item.name === productName);
        const quantitySpan = card.querySelector('.quantity');
        if (product) {
            quantitySpan.textContent = product.quantity;
        } else {
            quantitySpan.textContent = 0;
        }
    });
}

// Function to update cart
function updateCart(name, price, quantityChange) {
    let productFound = false;
    cart = cart.map(item => {
        if (item.name === name) {
            item.quantity += quantityChange;
            productFound = true;
        }
        return item;
    });

    if (!productFound && quantityChange > 0) {
        cart.push({ name, price, quantity: quantityChange });
    }

    cart = cart.filter(item => item.quantity > 0); // Remove items with zero quantity
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart display on cart page
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');

    cartItemsDiv.innerHTML = ''; // Clear existing items

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    total -= appliedDiscount;

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <p>${item.name}</p>
            <p>Rs ${item.price} x ${item.quantity}</p>
            <button class="remove-item" data-name="${item.name}">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });

    // Display total amount
    cartTotalDiv.innerHTML = `<h3>Total: Rs ${total}</h3>`;
    localStorage.setItem('cartTotal', total);  // Save the updated total to localStorage
}

// Event listener for remove item button
document.getElementById('cart-items').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item')) {
        const productName = event.target.getAttribute('data-name');
        cart = cart.filter(item => item.name !== productName);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
});

// Apply coupon logic
document.getElementById('apply-coupon').addEventListener('click', () => {
    const couponCode = document.getElementById('coupon-code').value.trim().toLowerCase();
    const validCoupons = {
        '10%': 0.10,
        '20%': 0.20
    };
    const couponMessage = document.getElementById('coupon-message');

    if (validCoupons[couponCode]) {
        appliedDiscount = validCoupons[couponCode] * getTotal();
        couponMessage.textContent = `Applied ${couponCode} coupon!`;
        updateCartDisplay();
    } else {
        couponMessage.textContent = 'Invalid coupon code.';
    }
});

// Get the total amount from the cart
function getTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// On page load, update the cart display
if (document.body.classList.contains('cart')) {
    updateCartDisplay();
}

// Event listener for checkout button (proceed to payment)
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        localStorage.setItem('cartTotal', getTotal());  // Save the total amount before redirecting
        alert('Proceeding to Checkout!');
    } else {
        alert('Your cart is empty!');
    }
});

// Display cart on page load (cart page)
if (document.body.contains(document.getElementById('cart-items'))) {
    updateCartDisplay();
}
