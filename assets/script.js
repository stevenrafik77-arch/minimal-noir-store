// 1. Custom Cursor Logic (Works on all pages)
const cursor = document.getElementById('custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const updateHoverElements = () => {
        const hoverElements = document.querySelectorAll('a, button, .product-card, .relative');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    };
    updateHoverElements();

    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// 2. Shopping Cart Logic
let cart = [];
const sidebar = document.getElementById('cartSidebar');
const panel = document.getElementById('cartPanel');
const overlay = document.getElementById('cartOverlay');

function toggleCart() {
    if (!sidebar || !panel || !overlay) return;
    const isVisible = !sidebar.classList.contains('invisible');
    if (isVisible) {
        panel.style.transform = 'translateX(100%)';
        overlay.style.opacity = '0';
        setTimeout(() => { 
            sidebar.classList.add('invisible'); 
            document.body.classList.remove('cart-open'); 
        }, 500);
    } else {
        sidebar.classList.remove('invisible');
        document.body.classList.add('cart-open');
        setTimeout(() => { 
            panel.style.transform = 'translateX(0)'; 
            overlay.style.opacity = '1'; 
        }, 10);
    }
}

if (overlay) overlay.addEventListener('click', toggleCart);

function addToCart(button, name, price) {
    const card = button.closest('.product-card');
    const imgSrc = card.querySelector('.product-img').src;
    cart.push({ id: Date.now(), name, price, img: imgSrc });
    updateCartUI();
    toggleCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    const countLabel = document.getElementById('cartCountLabel');

    if (countLabel) countLabel.innerText = cart.length;
    if (!list || !total) return;

    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-600 mt-20 italic">Your cart is currently empty..</p>';
        total.innerText = '0 SAR';
        return;
    }

    let sum = 0;
    cart.forEach(item => {
        sum += item.price;
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-4 border-b border-white/5 pb-6';
        div.innerHTML = `
            <img src="${item.img}" class="w-16 h-20 object-cover bg-neutral-900 border border-white/10 grayscale hover:grayscale-0 transition-all">
            <div class="flex-1 text-left"><h4 class="text-[10px] font-bold uppercase">${item.name}</h4><p class="text-gray-500 text-[11px] mt-1">${item.price} SAR</p></div>
            <button onclick="removeItem(${item.id})" class="text-gray-600 hover:text-white transition-all">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>`;
        list.appendChild(div);
    });
    total.innerText = sum + ' SAR';
    updateHoverElements();
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty, please add products first.");
        return;
    }
    const container = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal').innerText;
    container.innerHTML = `
        <div class="animate-item space-y-6 pt-4 text-left">
            <h3 class="text-xs font-bold uppercase tracking-[0.4em] mb-8 border-b border-white/10 pb-4 text-white">Shipping Details</h3>
            <div class="space-y-4">
                <input type="text" placeholder="Full Name" class="w-full bg-transparent border-b border-white/10 py-3 text-xs focus:border-white outline-none transition-all">
                <input type="text" placeholder="Phone Number" class="w-full bg-transparent border-b border-white/10 py-3 text-xs focus:border-white outline-none transition-all">
                <input type="text" placeholder="Address (City, District)" class="w-full bg-transparent border-b border-white/10 py-3 text-xs focus:border-white outline-none transition-all">
            </div>
            <div class="bg-white/5 p-4 mt-10"><p class="text-[10px] text-gray-500 mb-2 uppercase">Order Summary</p><div class="flex justify-between text-xs"><span>Subtotal:</span><span>${total}</span></div></div>
            <button onclick="confirmOrder()" class="glow-button w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">Confirm Final Order</button>
            <button onclick="updateCartUI()" class="w-full text-[9px] text-gray-600 uppercase tracking-widest mt-4 hover:text-white transition-all">← Back to Cart</button>
        </div>`;
    updateHoverElements();
}

function confirmOrder() {
    alert("Thank you! Your order has been received successfully. We will contact you soon.");
    cart = [];
    updateCartUI();
    toggleCart();
}

// 3. Update Active Links on Scroll (Index Page only)
window.addEventListener('scroll', () => {
    const productsSection = document.getElementById('products');
    const navHome = document.getElementById('nav-home');
    const navProducts = document.getElementById('nav-products');
    if (!productsSection || !navHome || !navProducts) return;
    
    const sectionTop = productsSection.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
        navProducts.classList.add('active-link');
        navHome.classList.remove('active-link');
    } else {
        navHome.classList.add('active-link');
        navProducts.classList.remove('active-link');
    }
});