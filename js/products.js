// Website Development Services and Packages
const products = [
    {
        id: 1,
        title: "Starter Site",
        description: "Mobile responsive, basic layout, contact form (EmailJS), static hosting",
        price: 499,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        category: "all",
        features: [
            "1 Page",
            "Mobile responsive",
            "Basic layout",
            "Contact form (EmailJS)",
            "Static hosting"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript"],
        deliveryTime: "7–10 days",
        idealFor: "Students, personal resumes"
    },
    {
        id: 2,
        title: "Pro Site",
        description: "Animations, form, basic SEO, gallery, responsive design",
        price: 999,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
        category: "all",
        features: [
            "Up to 3 Pages",
            "Animations",
            "Contact form",
            "Basic SEO",
            "Gallery",
            "Responsive design"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "SEO Tools"],
        deliveryTime: "10–15 days",
        idealFor: "Freelancers, small creators"
    },
    {
        id: 3,
        title: "Business Site",
        description: "Full custom layout, SEO, Stripe pay buttons, image sourcing, animations",
        price: 1499,
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
        category: "all",
        features: [
            "Up to 5 Pages",
            "Full custom layout",
            "SEO",
            "Stripe pay buttons",
            "Image sourcing",
            "Custom animations"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "Stripe API", "SEO Tools"],
        deliveryTime: "15–25 days",
        idealFor: "Shops, professionals, portfolios"
    },
    {
        id: 4,
        title: "Custom Elite",
        description: "Everything in Business + custom JS, payment gateway, client dashboard",
        price: 2499,
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
        category: "all",
        features: [
            "Unlimited Pages",
            "Everything in Business",
            "Custom JS",
            "Full payment gateway",
            "Client dashboard"
        ],
        technologies: ["React", "Node.js", "Custom JavaScript", "Payment Gateways", "Database"],
        deliveryTime: "1–1.5 months",
        idealFor: "Startups, complex portfolios"
    }
];

// Function to render products
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">No website packages found.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}" onclick="showProductDetails(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                <div class="product-ideal-for">Ideal for: ${product.idealFor}</div>
                <div class="product-actions">
                    <button class="btn-view-details" onclick="event.stopPropagation(); showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); orderPackage(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to show product details in modal
function showProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'productDetailsModal';
    
    modal.innerHTML = `
        <div class="modal-content product-details-modal">
            <span class="close" onclick="closeProductDetails()">&times;</span>
            <div class="product-details-container">
                <div class="product-details-header">
                    <div class="product-details-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-details-info">
                        <h2>${product.title}</h2>
                        <p class="product-details-description">${product.description}</p>
                        <div class="product-details-price">₹${product.price}</div>
                        <div class="product-ideal-for">Ideal for: ${product.idealFor}</div>
                        <div class="product-details-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>Delivery: ${product.deliveryTime}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-redo"></i>
                                <span>${product.revisions}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="product-details-content">
                    <div class="features-section">
                        <h3><i class="fas fa-check-circle"></i> What's Included</h3>
                        <ul class="features-list">
                            ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="technologies-section">
                        <h3><i class="fas fa-code"></i> Technologies Used</h3>
                        <div class="tech-tags">
                            ${product.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="demo-section">
                        <h3><i class="fas fa-external-link-alt"></i> Live Demo</h3>
                        <a href="${product.demo}" target="_blank" class="demo-link">
                            <i class="fas fa-eye"></i> View Live Demo
                        </a>
                    </div>
                </div>
                
                <div class="product-details-actions">
                    <button class="btn-add-cart-large" onclick="orderPackage(${product.id}); closeProductDetails();">
                        <i class="fas fa-shopping-cart"></i> Order This Package - ₹${product.price}
                    </button>
                    <button class="btn-contact" onclick="contactAboutProject(${product.id})">
                        <i class="fas fa-comments"></i> Discuss Custom Requirements
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Function to close product details modal
function closeProductDetails() {
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Function to contact about custom project
function contactAboutProject(productId) {
    const product = getProductById(productId);
    const subject = encodeURIComponent(`Custom Website Project - ${product.title}`);
    const body = encodeURIComponent(
        `Hi,\n\nI'm interested in the "${product.title}" package but would like to discuss custom requirements.\n\n` +
        `Package Details:\n` +
        `- Price: ₹${product.price}\n` +
        `- Delivery: ${product.deliveryTime}\n\n` +
        `Please contact me to discuss my specific needs.\n\n` +
        `Thanks!`
    );
    
    window.open(`mailto:websiteinaflash@outlook.com?subject=${subject}&body=${body}`);
    closeProductDetails();
}

// Function to filter products by category
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

// Function to search products
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts(filteredProducts);
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Render all products initially
    renderProducts();
    
    // Add event listeners for category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });
    
    // Add event listener for search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query === '') {
                renderProducts();
            } else {
                searchProducts(query);
            }
        });
        
        // Also listen for Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query === '') {
                    renderProducts();
                } else {
                    searchProducts(query);
                }
            }
        });
    }
});

// Function to redirect to order page with selected package
function orderPackage(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Store package details in localStorage for the order page
    localStorage.setItem('selectedPackage', JSON.stringify(product));
    
    // Redirect to order page
    window.location.href = `order.html?package=${productId}`;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, getProductById };
}

