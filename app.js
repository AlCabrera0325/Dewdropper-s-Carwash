// ============================
// Navigation Tabs
// ============================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Remove active from all nav links and sections
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Add active to clicked link and target section
    link.classList.add('active');
    const targetSection = document.querySelector(link.dataset.target);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  });
});

// ============================
// Cart System with Images 🛒
// ============================
let cart = [];

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmountElement = document.getElementById('cart-total-amount');

// Add to Cart from services
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const img = button.dataset.img;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, selected: true, img });
    }

    renderCart();
    updateTotal();
  });
});

// Render Cart UI
function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
    row.classList.add('cart-item');
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-img">
      <div class="cart-info">
        <p class="cart-name">${item.name}</p>
        <p class="cart-price">₱${item.price}</p>
      </div>
      <div class="cart-select">
        <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''}>
      </div>
      <div class="cart-quantity">
        <button class="qty-btn minus" data-name="${item.name}">-</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn plus" data-name="${item.name}">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(row);
  });

  attachCartItemListeners();
}

// Attach events for quantity & selection after rendering
function attachCartItemListeners() {
  document.querySelectorAll('.plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const item = cart.find(i => i.name === name);
      if (item) item.quantity++;
      renderCart();
      updateTotal();
    });
  });

  document.querySelectorAll('.minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const item = cart.find(i => i.name === name);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          cart = cart.filter(i => i.name !== name);
        }
      }
      renderCart();
      updateTotal();
    });
  });

  document.querySelectorAll('.item-checkbox').forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
      cart[index].selected = checkbox.checked;
      updateTotal();
    });
  });
}

// Update total price dynamically
function updateTotal() {
  const total = cart.reduce((sum, item) => {
    return item.selected ? sum + item.price * item.quantity : sum;
  }, 0);

  totalAmountElement.textContent = total;
}

// ============================
// Pay Now Button
// ============================
document.getElementById('pay-btn').addEventListener('click', () => {
  const total = parseFloat(totalAmountElement.textContent);
  if (total === 0) {
    alert('Please select at least one service to pay.');
    return;
  }

  alert(`Thank you for your payment of ₱${total}! (Simulation)`);

  // Clear cart after payment
  cart = [];
  renderCart();
  updateTotal();
});
