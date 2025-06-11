// Authentication management
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initializeAuth();
    }

    // Initialize authentication on page load
    initializeAuth() {
        this.updateUI();
        this.setupEventListeners();
    }

    // Setup event listeners for authentication
    setupEventListeners() {
        // Login modal triggers
        const loginBtn = document.getElementById('loginBtn');
        const loginModal = document.getElementById('loginModal');
        const closeLogin = document.getElementById('closeLogin');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.currentUser) {
                    this.toggleUserDropdown();
                } else {
                    this.showModal('loginModal');
                }
            });
        }

        if (closeLogin) {
            closeLogin.addEventListener('click', () => {
                this.hideModal('loginModal');
            });
        }

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.getAttribute('data-tab'));
            });
        });

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    // Switch between login and register tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tabName}Form`).classList.add('active');
    }

    // Handle login form submission
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Basic validation
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        // Check if user exists in localStorage
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.setCurrentUser({
                id: user.id,
                name: user.name,
                email: user.email
            });
            this.hideModal('loginModal');
            this.showToast('Login successful!', 'success');
            this.updateUI();
        } else {
            this.showToast('Invalid email or password', 'error');
        }
    }

    // Handle register form submission
    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        const users = this.getStoredUsers();
        if (users.find(u => u.email === email)) {
            this.showToast('An account with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(), // Simple ID generation
            name: name,
            email: email,
            password: password // In a real app, this would be hashed
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto-login the new user
        this.setCurrentUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });

        this.hideModal('loginModal');
        this.showToast('Account created successfully!', 'success');
        this.updateUI();

        // Clear form
        document.getElementById('registerForm').reset();
    }

    // Handle logout
    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUI();
        this.showToast('Logged out successfully', 'success');
        this.hideUserDropdown();
    }

    // Get stored users from localStorage
    getStoredUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    // Get current user from localStorage
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    // Set current user in localStorage
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Update UI based on authentication state
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userDropdown = document.getElementById('userDropdown');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (loginBtn) loginBtn.textContent = this.currentUser.name;
            if (userName) userName.textContent = `Welcome, ${this.currentUser.name}!`;
            if (userDropdown) userDropdown.style.display = 'block';
        } else {
            if (loginBtn) loginBtn.textContent = 'Login';
            if (userDropdown) userDropdown.style.display = 'none';
        }
    }

    // Toggle user dropdown
    toggleUserDropdown() {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            const isVisible = userDropdown.style.display === 'block';
            userDropdown.style.display = isVisible ? 'none' : 'block';
        }
    }

    // Hide user dropdown
    hideUserDropdown() {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.style.display = 'none';
        }
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

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user info
    getCurrentUserInfo() {
        return this.currentUser;
    }

    // Require authentication for certain actions
    requireAuth(callback, message = 'Please log in to continue') {
        if (this.isLoggedIn()) {
            callback();
        } else {
            this.showToast(message, 'warning');
            this.showModal('loginModal');
        }
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Make auth manager globally available
window.authManager = authManager;

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

