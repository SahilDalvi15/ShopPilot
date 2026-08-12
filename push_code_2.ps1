git add backend/src/models/Cart.model.js backend/src/models/OrderItem.model.js
git commit -m "Update database schemas to support selectedSize"
git push

git add backend/src/services/cart.service.js
git commit -m "Handle selectedSize in cart operations"
git push

git add backend/src/services/order.service.js
git commit -m "Transfer selectedSize during order creation"
git push
