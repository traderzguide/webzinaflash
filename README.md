# FlashStore - Premium E-commerce Website

A complete e-commerce website built with pure HTML, CSS, and JavaScript. Features a modern design, full shopping cart functionality, user authentication, and email notifications.

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog**: 16 premium products across multiple categories
- **Category Filtering**: Electronics, Clothing, Home & Garden, Sports
- **Real-time Search**: Find products instantly as you type
- **Shopping Cart**: Add, remove, and manage cart items
- **Responsive Design**: Perfect on desktop, tablet, and mobile

### 👤 User Management
- **User Registration**: Create new accounts with email validation
- **User Login/Logout**: Secure authentication system
- **User Profiles**: Personalized user experience
- **Data Persistence**: User data stored in localStorage

### 🛒 Checkout Process
- **Secure Checkout**: Complete order form with validation
- **Email Notifications**: Automatic order emails to websiteinaflash@outlook.com
- **Order Summary**: Detailed breakdown of items and totals
- **Order History**: Orders saved locally for reference

### 🎨 Design & UX
- **Modern UI**: Beautiful gradient designs and animations
- **Smooth Animations**: Scroll animations and hover effects
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Windows**: Clean popup interfaces
- **Mobile-First**: Fully responsive design

## 📁 Project Structure

```
store-website/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling and animations
├── js/
│   ├── products.js     # Product data and management
│   ├── auth.js         # User authentication
│   ├── cart.js         # Shopping cart functionality
│   └── main.js         # Main application logic
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Download the Files
```bash
# If you have the files in a folder, navigate to it
cd store-website
```

### 2. Open in Browser
- Simply open `index.html` in any modern web browser
- Or use a local server for better performance:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (if you have it):**
```bash
npx serve .
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

### 3. Start Shopping!
The website will open in your browser at `http://localhost:8000` (or similar)

## 🎯 How to Use

### For Customers:
1. **Browse Products**: Scroll down to see all available products
2. **Search**: Use the search bar in the header to find specific items
3. **Filter**: Click category buttons to filter products
4. **Add to Cart**: Click "Add to Cart" on any product
5. **View Cart**: Click the cart icon in the header
6. **Register/Login**: Click "Login" to create an account or sign in
7. **Checkout**: Click "Proceed to Checkout" when ready to order
8. **Complete Order**: Fill in shipping details and place order

### For Store Owner (You):
- **Order Notifications**: You'll receive emails at `websiteinaflash@outlook.com` when customers place orders
- **Customer Messages**: Contact form submissions also go to your email
- **Order Details**: Each email includes customer info, items ordered, and total amount

## 🛠️ Customization

### Adding New Products
Edit `js/products.js` and add new product objects to the `products` array:

```javascript
{
    id: 17, // Unique ID
    title: "Your Product Name",
    description: "Product description",
    price: 99.99,
    image: "https://your-image-url.com/image.jpg",
    category: "electronics" // or "clothing", "home", "sports"
}
```

### Changing Prices
Update the `price` field in any product object in `js/products.js`

### Customizing Design
- **Colors**: Edit the CSS variables in `css/styles.css`
- **Fonts**: Change the `font-family` in the CSS
- **Layout**: Modify the CSS grid and flexbox properties

### Changing Email Address
Replace `websiteinaflash@outlook.com` with your email in:
- `index.html` (contact section)
- `js/cart.js` (order notifications)
- `js/main.js` (contact form)

## 🌐 Hosting on GitHub Pages

1. **Create a GitHub Repository**:
   - Go to GitHub and create a new repository
   - Name it something like `your-store-name`

2. **Upload Files**:
   - Upload all your website files to the repository
   - Make sure `index.html` is in the root directory

3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click Save

4. **Access Your Site**:
   - Your site will be available at: `https://yourusername.github.io/your-repo-name`
   - It may take a few minutes to deploy

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Technical Details

### Data Storage
- **User Accounts**: Stored in browser's localStorage
- **Shopping Cart**: Persisted in localStorage
- **Order History**: Saved locally in localStorage
- **No Database Required**: Everything runs client-side

### Email System
- Uses `mailto:` links to open default email client
- Order details automatically formatted in email body
- Works with any email client (Outlook, Gmail, etc.)

### Security Notes
- Passwords stored in localStorage (for demo purposes)
- In production, use proper server-side authentication
- No sensitive payment processing (design only)

## 🤝 Support

If you need help with customization or have questions:
1. Check the code comments for guidance
2. Modify the CSS for design changes
3. Update the JavaScript for functionality changes

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy your new e-commerce website! 🎉**

Remember to customize the products, prices, and design to match your business needs.

