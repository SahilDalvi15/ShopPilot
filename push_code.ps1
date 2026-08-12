git add Backend/src/models/Cart.model.js Backend/src/models/OrderItem.model.js
git commit -m "Update database schemas to support selectedSize"
git push

git add Backend/src/services/cart.service.js
git commit -m "Handle selectedSize in cart operations"
git push

git add Backend/src/services/order.service.js
git commit -m "Transfer selectedSize during order creation"
git push

git add frontend/src/pages/ProductDetailPage.jsx
git commit -m "Implement size selection UI for clothing products"
git push

git add frontend/src/pages/CartPage.jsx frontend/src/pages/CheckoutPage.jsx
git commit -m "Display selectedSize in Cart and Checkout"
git push

git add frontend/src/pages/OrdersPage.jsx
git commit -m "Display selectedSize in order history"
git push
