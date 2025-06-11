// Order page functionality

// Get package details from URL parameters or localStorage
let selectedPackage = null;

// Initialize order page
document.addEventListener('DOMContentLoaded', function() {
    loadSelectedPackage();
    setupEventListeners();
    calculateTotal();
});

// Load selected package details
function loadSelectedPackage() {
    // Get package ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    
    // If no package ID, try to get from localStorage
    if (!packageId) {
        const storedPackage = localStorage.getItem('selectedPackage');
        if (storedPackage) {
            selectedPackage = JSON.parse(storedPackage);
        } else {
            // Redirect to home if no package selected
            window.location.href = 'index.html';
            return;
        }
    } else {
        // Load package details based on ID
        selectedPackage = getPackageById(parseInt(packageId));
        if (!selectedPackage) {
            window.location.href = 'index.html';
            return;
        }
    }
    
    displayPackageDetails();
}

// Get package by ID (from products.js structure)
function getPackageById(id) {
    const packages = [
        {
            id: 1,
            title: "Starter Site",
            description: "Mobile responsive, basic layout, contact form (EmailJS), static hosting",
            price: 499,
            features: [
                "1 Page",
                "Mobile responsive",
                "Basic layout",
                "Contact form (EmailJS)",
                "Static hosting"
            ],
            deliveryTime: "7–10 days",
            idealFor: "Students, personal resumes"
        },
        {
            id: 2,
            title: "Pro Site",
            description: "Animations, form, basic SEO, gallery, responsive design",
            price: 999,
            features: [
                "Up to 3 Pages",
                "Animations",
                "Contact form",
                "Basic SEO",
                "Gallery",
                "Responsive design"
            ],
            deliveryTime: "10–15 days",
            idealFor: "Freelancers, small creators"
        },
        {
            id: 3,
            title: "Business Site",
            description: "Full custom layout, SEO, Stripe pay buttons, image sourcing, animations",
            price: 1499,
            features: [
                "Up to 5 Pages",
                "Full custom layout",
                "SEO",
                "Stripe pay buttons",
                "Image sourcing",
                "Custom animations"
            ],
            deliveryTime: "15–25 days",
            idealFor: "Shops, professionals, portfolios"
        },
        {
            id: 4,
            title: "Custom Elite",
            description: "Everything in Business + custom JS, payment gateway, client dashboard",
            price: 2499,
            features: [
                "Unlimited Pages",
                "Everything in Business",
                "Custom JS",
                "Full payment gateway",
                "Client dashboard"
            ],
            deliveryTime: "1–1.5 months",
            idealFor: "Startups, complex portfolios"
        }
    ];
    
    return packages.find(pkg => pkg.id === id);
}

// Display package details in the sidebar
function displayPackageDetails() {
    if (!selectedPackage) return;
    
    const packageDetailsContainer = document.getElementById('packageDetails');
    
    packageDetailsContainer.innerHTML = `
        <div class="package-info">
            <div class="package-name">${selectedPackage.title}</div>
            <div class="package-price">₹${selectedPackage.price}</div>
            <div class="package-description">${selectedPackage.description}</div>
            <ul class="package-features">
                ${selectedPackage.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
            <div class="package-delivery">
                <strong>Delivery Time:</strong> ${selectedPackage.deliveryTime}
            </div>
        </div>
    `;
    
    // Update order summary
    updateOrderSummary();
}

// Update order summary with pricing
function updateOrderSummary() {
    if (!selectedPackage) return;
    
    const packagePrice = selectedPackage.price;
    const tax = Math.round(packagePrice * 0.18); // 18% GST
    const total = packagePrice + tax;
    
    document.getElementById('summaryPackageName').textContent = selectedPackage.title;
    document.getElementById('summaryPackagePrice').textContent = `₹${packagePrice}`;
    document.getElementById('summaryTax').textContent = `₹${tax}`;
    document.getElementById('summaryTotal').textContent = `₹${total}`;
}

// Calculate total on page load
function calculateTotal() {
    if (selectedPackage) {
        updateOrderSummary();
    }
}

// Setup event listeners
function setupEventListeners() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }
    
    // Add payment method change listeners
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
}

// Handle payment method change
function handlePaymentMethodChange(event) {
    const selectedMethod = event.target.value;
    console.log('Selected payment method:', selectedMethod);
    
    // You can add specific logic for different payment methods here
    // For example, show/hide additional fields based on payment method
}

// Handle order form submission
function handleOrderSubmission(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = collectFormData();
    
    // Show loading state
    const submitButton = document.querySelector('.btn-place-order');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        processOrder(formData);
    }, 2000);
}

// Validate form data
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    // Required fields validation
    const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'websitePurpose',
        'businessDescription',
        'websiteGoals',
        'targetAudience',
        'contentPages'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
            formGroup.classList.add('error');
            isValid = false;
        }
    });
    
    // Payment method validation
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        showToast('Please select a payment method', 'error');
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        document.getElementById('email').closest('.form-group').classList.add('error');
        showToast('Please enter a valid email address', 'error');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s+/g, ''))) {
        document.getElementById('phone').closest('.form-group').classList.add('error');
        showToast('Please enter a valid phone number', 'error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Please fill in all required fields correctly', 'error');
    }
    
    return isValid;
}

// Collect form data
function collectFormData() {
    const formData = {
        package: selectedPackage,
        contact: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value
        },
        website: {
            purpose: document.getElementById('websitePurpose').value,
            businessDescription: document.getElementById('businessDescription').value,
            goals: document.getElementById('websiteGoals').value,
            targetAudience: document.getElementById('targetAudience').value,
            contentPages: document.getElementById('contentPages').value,
            designPreferences: document.getElementById('designPreferences').value,
            specialRequirements: document.getElementById('specialRequirements').value,
            existingWebsite: document.getElementById('existingWebsite').value
        },
        payment: {
            method: document.querySelector('input[name="paymentMethod"]:checked').value
        },
        pricing: {
            packagePrice: selectedPackage.price,
            tax: Math.round(selectedPackage.price * 0.18),
            total: selectedPackage.price + Math.round(selectedPackage.price * 0.18)
        }
    };
    
    return formData;
}

// Process order (redirect to payment page)
function processOrder(formData) {
    console.log('Processing order:', formData);
    
    // Store order data for payment page
    localStorage.setItem('orderData', JSON.stringify(formData));
    
    // Show success message and redirect to payment
    setTimeout(() => {
        showOrderSuccess(formData);
    }, 1000);
}

// Send order details via email
function sendOrderEmail(formData) {
    const emailBody = formatOrderEmailBody(formData);
    
    // Create a form and submit to formspree
    const form = document.createElement('form');
    form.action = 'https://formspree.io/f/xeokgqww'; // Replace with your formspree endpoint
    form.method = 'POST';
    form.style.display = 'none';
    
    // Add form fields
    const fields = {
        '_subject': `New Website Order - ${formData.package.title}`,
        'name': `${formData.contact.firstName} ${formData.contact.lastName}`,
        'email': formData.contact.email,
        'phone': formData.contact.phone,
        'company': formData.contact.company,
        'package': formData.package.title,
        'total': `₹${formData.pricing.total}`,
        'message': emailBody
    };
    
    Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

// Format order details for email
function formatOrderEmailBody(formData) {
    return `
NEW WEBSITE ORDER RECEIVED

=== PACKAGE DETAILS ===
Package: ${formData.package.title}
Price: ₹${formData.package.price}
Tax (18% GST): ₹${formData.pricing.tax}
Total: ₹${formData.pricing.total}
Delivery Time: ${formData.package.deliveryTime}
Payment Method: ${formData.payment.method.toUpperCase()}

=== CUSTOMER DETAILS ===
Name: ${formData.contact.firstName} ${formData.contact.lastName}
Email: ${formData.contact.email}
Phone: ${formData.contact.phone}
Company: ${formData.contact.company || 'N/A'}

=== WEBSITE REQUIREMENTS ===
Purpose: ${formData.website.purpose}

Business Description:
${formData.website.businessDescription}

Website Goals:
${formData.website.goals}

Target Audience:
${formData.website.targetAudience}

Required Pages/Sections:
${formData.website.contentPages}

Design Preferences:
${formData.website.designPreferences || 'No specific preferences mentioned'}

Special Requirements:
${formData.website.specialRequirements || 'None mentioned'}

Existing Website/Domain:
${formData.website.existingWebsite || 'None'}

=== PACKAGE FEATURES ===
${formData.package.features.map(feature => `- ${feature}`).join('\n')}

Please contact the customer within 24 hours to confirm the order and discuss next steps.
    `.trim();
}

// Show order success message
function showOrderSuccess(formData) {
    const submitButton = document.querySelector('.btn-place-order');
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you ${formData.contact.firstName}! We've received your order for the <strong>${formData.package.title}</strong> package.</p>
            <p>We'll contact you within 24 hours to discuss your project details and next steps.</p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <strong>Order Details:</strong><br>
                Package: ${formData.package.title}<br>
                Total: ₹${formData.pricing.total}<br>
                Delivery: ${formData.package.deliveryTime}
            </div>
            <button onclick="goToHome()" class="btn-success">Back to Home</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Go back to home page
function goToHome() {
    window.location.href = 'index.html';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Export for global access
window.goToHome = goToHome;

