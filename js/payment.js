// Payment page functionality

let orderData = null;

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    setupEventListeners();
    setupFormValidation();
});

// Load order data from localStorage or URL
function loadOrderData() {
    // Try to get order data from localStorage
    const storedOrderData = localStorage.getItem('orderData');
    if (storedOrderData) {
        orderData = JSON.parse(storedOrderData);
        displayOrderSummary();
    } else {
        // If no order data, redirect back to order page
        showToast('No order data found. Please complete the order form first.', 'error');
        setTimeout(() => {
            window.location.href = 'order.html';
        }, 3000);
    }
}

// Display order summary in sidebar
function displayOrderSummary() {
    if (!orderData) return;
    
    const summaryContainer = document.getElementById('paymentSummary');
    const finalAmountElement = document.getElementById('finalAmount');
    
    summaryContainer.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">${orderData.package.title}</span>
            <span class="summary-value">₹${orderData.package.price}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Tax (18% GST)</span>
            <span class="summary-value">₹${orderData.pricing.tax}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Delivery Time</span>
            <span class="summary-value">${orderData.package.deliveryTime}</span>
        </div>
        <div class="summary-total">
            <span class="total-label">Total Amount</span>
            <span class="total-value">₹${orderData.pricing.total}</span>
        </div>
    `;
    
    // Update final amount in payment button
    finalAmountElement.textContent = `₹${orderData.pricing.total}`;
    
    // Pre-fill billing information if available from order data
    if (orderData.contact) {
        document.getElementById('billingFirstName').value = orderData.contact.firstName || '';
        document.getElementById('billingLastName').value = orderData.contact.lastName || '';
    }
}

// Setup event listeners
function setupEventListeners() {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmission);
    }
    
    // Payment method change listeners
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Wallet type change listener
    const walletTypes = document.querySelectorAll('input[name="walletType"]');
    walletTypes.forEach(wallet => {
        wallet.addEventListener('change', handleWalletTypeChange);
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
        cardNumberInput.addEventListener('input', detectCardType);
    }
    
    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', formatExpiryDate);
    }
    
    // CVV input restriction
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Handle payment method change
function handlePaymentMethodChange(event) {
    const selectedMethod = event.target.value;
    
    // Hide all payment detail sections
    document.getElementById('cardDetails').style.display = 'none';
    document.getElementById('upiDetails').style.display = 'none';
    document.getElementById('netBankingDetails').style.display = 'none';
    document.getElementById('walletDetails').style.display = 'none';
    
    // Show relevant payment detail section
    switch (selectedMethod) {
        case 'card':
            document.getElementById('cardDetails').style.display = 'block';
            break;
        case 'upi':
            document.getElementById('upiDetails').style.display = 'block';
            break;
        case 'netbanking':
            document.getElementById('netBankingDetails').style.display = 'block';
            break;
        case 'wallet':
            document.getElementById('walletDetails').style.display = 'block';
            break;
    }
}

// Handle wallet type change
function handleWalletTypeChange(event) {
    const walletType = event.target.value;
    const walletEmailGroup = document.getElementById('walletEmailGroup');
    
    // Show email field for PayPal and some other wallets
    if (walletType === 'paypal' || walletType === 'applepay') {
        walletEmailGroup.style.display = 'block';
        document.getElementById('walletEmail').required = true;
    } else {
        walletEmailGroup.style.display = 'none';
        document.getElementById('walletEmail').required = false;
    }
}

// Format card number with spaces
function formatCardNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
}

// Detect card type and show icon
function detectCardType(event) {
    const cardNumber = event.target.value.replace(/\s/g, '');
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
    if (cardNumber.startsWith('4')) {
        cardTypeIcon.innerHTML = '<i class="fab fa-cc-visa" style="color: #1a1f71;"></i>';
    } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
        cardTypeIcon.innerHTML = '<i class="fab fa-cc-mastercard" style="color: #eb001b;"></i>';
    } else if (cardNumber.startsWith('3')) {
        cardTypeIcon.innerHTML = '<i class="fab fa-cc-amex" style="color: #006fcf;"></i>';
    } else {
        cardTypeIcon.innerHTML = '';
    }
}

// Format expiry date MM/YY
function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
}

// Setup form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const formGroup = field.closest('.form-group');
    
    if (!formGroup) return;
    
    const isValid = field.checkValidity();
    
    if (isValid) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    } else {
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
    }
}

// Clear field error state
function clearFieldError(event) {
    const field = event.target;
    const formGroup = field.closest('.form-group');
    
    if (formGroup) {
        formGroup.classList.remove('error');
    }
}

// Handle payment form submission
function handlePaymentSubmission(event) {
    event.preventDefault();
    
    if (!validatePaymentForm()) {
        return;
    }
    
    const paymentData = collectPaymentData();
    
    // Show loading state
    const submitButton = document.querySelector('.btn-complete-payment');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        processPayment(paymentData);
    }, 3000);
}

// Validate payment form
function validatePaymentForm() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    // Check payment method selection
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        showToast('Please select a payment method', 'error');
        isValid = false;
    }
    
    // Validate based on selected payment method
    if (paymentMethod) {
        switch (paymentMethod.value) {
            case 'card':
                isValid = validateCardDetails() && isValid;
                break;
            case 'upi':
                isValid = validateUPIDetails() && isValid;
                break;
            case 'netbanking':
                isValid = validateNetBankingDetails() && isValid;
                break;
            case 'wallet':
                isValid = validateWalletDetails() && isValid;
                break;
        }
    }
    
    // Validate billing address
    isValid = validateBillingAddress() && isValid;
    
    // Check terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showToast('Please agree to the terms and conditions', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validate card details
function validateCardDetails() {
    let isValid = true;
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardHolder = document.getElementById('cardHolder').value;
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        markFieldError('cardNumber');
        showToast('Please enter a valid card number', 'error');
        isValid = false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        markFieldError('expiryDate');
        showToast('Please enter a valid expiry date (MM/YY)', 'error');
        isValid = false;
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
        markFieldError('cvv');
        showToast('Please enter a valid CVV', 'error');
        isValid = false;
    }
    
    if (!cardHolder.trim()) {
        markFieldError('cardHolder');
        showToast('Please enter the cardholder name', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validate UPI details
function validateUPIDetails() {
    const upiId = document.getElementById('upiId').value;
    
    if (!upiId.trim() || !upiId.includes('@')) {
        markFieldError('upiId');
        showToast('Please enter a valid UPI ID', 'error');
        return false;
    }
    
    return true;
}

// Validate Net Banking details
function validateNetBankingDetails() {
    const bankSelect = document.getElementById('bankSelect').value;
    
    if (!bankSelect) {
        markFieldError('bankSelect');
        showToast('Please select your bank', 'error');
        return false;
    }
    
    return true;
}

// Validate Wallet details
function validateWalletDetails() {
    const walletType = document.querySelector('input[name="walletType"]:checked');
    
    if (!walletType) {
        showToast('Please select a wallet type', 'error');
        return false;
    }
    
    // Check if email/phone is required for selected wallet
    const walletEmail = document.getElementById('walletEmail');
    if (walletEmail.required && !walletEmail.value.trim()) {
        markFieldError('walletEmail');
        showToast('Please enter your email or phone number', 'error');
        return false;
    }
    
    return true;
}

// Validate billing address
function validateBillingAddress() {
    let isValid = true;
    
    const requiredFields = [
        'billingFirstName',
        'billingLastName',
        'billingAddress',
        'billingCity',
        'billingState',
        'billingPincode',
        'billingCountry'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            markFieldError(fieldId);
            isValid = false;
        }
    });
    
    // Validate PIN code for India
    const pincode = document.getElementById('billingPincode').value;
    const country = document.getElementById('billingCountry').value;
    
    if (country === 'IN' && !/^\d{6}$/.test(pincode)) {
        markFieldError('billingPincode');
        showToast('Please enter a valid 6-digit PIN code', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Mark field as error
function markFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
    }
}

// Collect payment data
function collectPaymentData() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    const paymentData = {
        orderData: orderData,
        paymentMethod: paymentMethod,
        billingAddress: {
            firstName: document.getElementById('billingFirstName').value,
            lastName: document.getElementById('billingLastName').value,
            address: document.getElementById('billingAddress').value,
            city: document.getElementById('billingCity').value,
            state: document.getElementById('billingState').value,
            pincode: document.getElementById('billingPincode').value,
            country: document.getElementById('billingCountry').value
        }
    };
    
    // Add payment method specific data
    switch (paymentMethod) {
        case 'card':
            paymentData.cardDetails = {
                cardNumber: document.getElementById('cardNumber').value,
                expiryDate: document.getElementById('expiryDate').value,
                cvv: document.getElementById('cvv').value,
                cardHolder: document.getElementById('cardHolder').value
            };
            break;
        case 'upi':
            paymentData.upiDetails = {
                upiId: document.getElementById('upiId').value
            };
            break;
        case 'netbanking':
            paymentData.netBankingDetails = {
                bank: document.getElementById('bankSelect').value
            };
            break;
        case 'wallet':
            const walletType = document.querySelector('input[name="walletType"]:checked');
            paymentData.walletDetails = {
                walletType: walletType ? walletType.value : '',
                email: document.getElementById('walletEmail').value
            };
            break;
    }
    
    return paymentData;
}

// Process payment (simulate payment gateway)
function processPayment(paymentData) {
    console.log('Processing payment:', paymentData);
    
    // Here you would typically:
    // 1. Send payment data to your payment gateway
    // 2. Handle payment gateway response
    // 3. Send confirmation emails
    // 4. Update order status
    
    // For now, we'll simulate a successful payment
    setTimeout(() => {
        // Send payment confirmation email
        sendPaymentConfirmationEmail(paymentData);
        
        // Show success message
        showPaymentSuccess(paymentData);
        
        // Clear stored data
        localStorage.removeItem('orderData');
        localStorage.removeItem('selectedPackage');
    }, 1000);
}

// Send payment confirmation email
function sendPaymentConfirmationEmail(paymentData) {
    const emailBody = formatPaymentConfirmationEmail(paymentData);
    
    // Create a form and submit to formspree
    const form = document.createElement('form');
    form.action = 'https://formspree.io/f/xeokgqww'; // Replace with your formspree endpoint
    form.method = 'POST';
    form.style.display = 'none';
    
    const fields = {
        '_subject': `Payment Confirmation - Order #${Date.now()}`,
        'name': `${paymentData.orderData.contact.firstName} ${paymentData.orderData.contact.lastName}`,
        'email': paymentData.orderData.contact.email,
        'phone': paymentData.orderData.contact.phone,
        'package': paymentData.orderData.package.title,
        'amount': `₹${paymentData.orderData.pricing.total}`,
        'payment_method': paymentData.paymentMethod,
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

// Format payment confirmation email
function formatPaymentConfirmationEmail(paymentData) {
    return `
PAYMENT CONFIRMATION - ORDER COMPLETED

Order ID: #${Date.now()}
Payment Status: SUCCESSFUL

=== PACKAGE DETAILS ===
Package: ${paymentData.orderData.package.title}
Price: ₹${paymentData.orderData.package.price}
Tax (18% GST): ₹${paymentData.orderData.pricing.tax}
Total Paid: ₹${paymentData.orderData.pricing.total}
Delivery Time: ${paymentData.orderData.package.deliveryTime}

=== PAYMENT DETAILS ===
Payment Method: ${paymentData.paymentMethod.toUpperCase()}
Payment Date: ${new Date().toLocaleString()}

=== CUSTOMER DETAILS ===
Name: ${paymentData.orderData.contact.firstName} ${paymentData.orderData.contact.lastName}
Email: ${paymentData.orderData.contact.email}
Phone: ${paymentData.orderData.contact.phone}
Company: ${paymentData.orderData.contact.company || 'N/A'}

=== BILLING ADDRESS ===
${paymentData.billingAddress.firstName} ${paymentData.billingAddress.lastName}
${paymentData.billingAddress.address}
${paymentData.billingAddress.city}, ${paymentData.billingAddress.state} ${paymentData.billingAddress.pincode}
${paymentData.billingAddress.country}

=== WEBSITE REQUIREMENTS ===
Purpose: ${paymentData.orderData.website.purpose}

Business Description:
${paymentData.orderData.website.businessDescription}

Website Goals:
${paymentData.orderData.website.goals}

Target Audience:
${paymentData.orderData.website.targetAudience}

Required Pages:
${paymentData.orderData.website.contentPages}

Design Preferences:
${paymentData.orderData.website.designPreferences || 'None specified'}

Special Requirements:
${paymentData.orderData.website.specialRequirements || 'None specified'}

Existing Website:
${paymentData.orderData.website.existingWebsite || 'None'}

=== PACKAGE FEATURES ===
${paymentData.orderData.package.features.map(feature => `- ${feature}`).join('\n')}

=== NEXT STEPS ===
1. Project will be assigned to our development team
2. You will receive a project timeline within 24 hours
3. Regular updates will be provided via email
4. Project delivery as per the specified timeline

Thank you for choosing WebsiteInAFlash!
    `.trim();
}

// Show payment success modal
function showPaymentSuccess(paymentData) {
    const submitButton = document.querySelector('.btn-complete-payment');
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
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment! Your website project has been confirmed.</p>
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; text-align: left;">
                <strong>Order Summary:</strong><br>
                Order ID: #${Date.now()}<br>
                Package: ${paymentData.orderData.package.title}<br>
                Amount Paid: ₹${paymentData.orderData.pricing.total}<br>
                Delivery: ${paymentData.orderData.package.deliveryTime}<br>
                Payment Method: ${paymentData.paymentMethod.toUpperCase()}
            </div>
            <p><strong>What happens next?</strong></p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>You'll receive a detailed project timeline within 24 hours</li>
                <li>Our team will contact you to discuss project details</li>
                <li>Regular progress updates via email</li>
                <li>Project delivery as per schedule</li>
            </ul>
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

