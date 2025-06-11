// Cart management
class CartManager {
    constructor() {
        this.cart = this.getCartFromStorage();
        this.initializeCart();
    }

    // Initialize cart functionality
    initializeCart() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    // Setup event listeners for cart functionality
    setupEventListeners() {
        // Cart icon click
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                this.showCart();
            });
        }

        // Close cart modal
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.hideModal('cartModal');
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }

        // Close checkout modal
        const closeCheckout = document.getElementById('closeCheckout');
        if (closeCheckout) {
            closeCheckout.addEventListener('click', () => {
                this.hideModal('checkoutModal');
            });
        }

        // Checkout form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout();
            });
        }

        // Success modal close
        const closeSuccess = document.getElementById('closeSuccess');
        if (closeSuccess) {
            closeSuccess.addEventListener('click', () => {
                this.hideModal('successModal');
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    // Add product to cart
    addToCart(productId) {
        const product = getProductById(productId);
        if (!product) {
            this.showToast('Product not found', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartUI();
        this.showToast(`${product.title} added to cart!`, 'success');
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
        this.renderCartItems();
        this.showToast('Item removed from cart', 'success');
    }

    // Update quantity of product in cart
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartUI();
            this.renderCartItems();
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart UI (counter)
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        const itemCount = this.getCartItemCount();
        const total = this.getCartTotal();

        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }

        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }
    }

    // Show cart modal
    showCart() {
        this.renderCartItems();
        this.showModal('cartModal');
    }

    // Render cart items in modal
    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-btn" onclick="cartManager.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `).join('');
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }

        // Check if user is logged in
        if (!window.authManager.isLoggedIn()) {
            window.authManager.requireAuth(() => {
                this.proceedToCheckout();
            }, 'Please log in to proceed with checkout');
            return;
        }

        this.hideModal('cartModal');
        this.showCheckoutModal();
    }

    // Show checkout modal
    showCheckoutModal() {
        this.renderOrderSummary();
        this.prefillUserInfo();
        this.showModal('checkoutModal');
    }

    // Render order summary in checkout
    renderOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const orderTotal = document.getElementById('orderTotal');
        
        orderSummary.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span>${item.title} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        orderTotal.textContent = this.getCartTotal().toFixed(2);
    }

    // Prefill user information if logged in
    prefillUserInfo() {
        const user = window.authManager.getCurrentUserInfo();
        if (user) {
            const checkoutEmail = document.getElementById('checkoutEmail');
            if (checkoutEmail) {
                checkoutEmail.value = user.email;
            }
        }
    }

    // Handle checkout form submission
    handleCheckout() {
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('checkoutEmail').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value
        };

        // Basic validation
        if (!this.validateCheckoutForm(formData)) {
            return;
        }

        // Simulate order processing
        this.processOrder(formData);
    }

    // Validate checkout form
    validateCheckoutForm(data) {
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'];
        
        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                this.showToast(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showToast('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    // Process order (simulate)
    processOrder(customerData) {
        // Create order object
        const order = {
            id: Date.now(),
            customer: customerData,
            items: [...this.cart],
            total: this.getCartTotal(),
            status: 'pending',
            date: new Date().toISOString()
        };

        // Save order to localStorage (in a real app, this would go to a server)
        this.saveOrder(order);

        // Send email notification (simulate with mailto)
        this.sendOrderNotification(order);

        // Clear cart
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartUI();

        // Show success modal
        this.hideModal('checkoutModal');
        this.showModal('successModal');
    }

    // Save order to localStorage
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Send order notification email
    async sendOrderNotification(order) {
        // Log order details for debugging (you can check browser console)
        console.log('New order received:', {
            orderId: order.id,
            customer: `${order.customer.firstName} ${order.customer.lastName}`,
            email: order.customer.email,
            phone: order.customer.phone,
            address: `${order.customer.address}, ${order.customer.city}, ${order.customer.zipCode}`,
            items: order.items,
            total: order.total,
            date: new Date(order.date).toLocaleString()
        });
        
        // Prepare order details for email
        const itemsList = order.items.map(item => 
            `- ${item.title} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        const orderDetails = `
NEW ORDER RECEIVED - Order #${order.id}

Customer Information:
- Name: ${order.customer.firstName} ${order.customer.lastName}
- Email: ${order.customer.email}
- Phone: ${order.customer.phone}
- Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.zipCode}

Order Items:
${itemsList}

Order Total: $${order.total.toFixed(2)}
Order Date: ${new Date(order.date).toLocaleString()}

Please contact the customer to begin work on their website development project.
        `;
        
        // Send email via Formspree
        try {
            const response = await fetch('https://formspree.io/f/xeokgqww', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: order.customer.email,
                    message: orderDetails,
                    _subject: `New Website Order #${order.id} from ${order.customer.firstName} ${order.customer.lastName}`,
                    _replyto: order.customer.email,
                    orderId: order.id,
                    customerName: `${order.customer.firstName} ${order.customer.lastName}`,
                    orderTotal: order.total
                })
            });
            
            if (response.ok) {
                console.log('Order notification email sent successfully via Formspree');
            } else {
                console.error('Failed to send order notification email:', response.status);
            }
        } catch (error) {
            console.error('Error sending order notification email:', error);
        }
    }

    // Get cart from localStorage
    getCartFromStorage() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    // Save cart to localStorage
    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartUI();
        this.renderCartItems();
    }

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    // Show toast notification
    showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make cart manager globally available
window.cartManager = cartManager;

// Global function to add to cart (called from product cards)
function addToCart(productId) {
    cartManager.addToCart(productId);
}

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}

