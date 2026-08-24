create according to what we have build till now this is just the reference which you have to follow for your creation of mobile app 

# ShopPilot — Android & iOS Mobile App Development

You are working with an existing project called **ShopPilot**.

The ShopPilot **web application is already fully developed and its features are complete**. Your task is NOT to create another web application.

Your task is to create a **mobile application for Android and iOS** that provides the appropriate ShopPilot functionality on mobile devices.

The mobile app must use the **existing ShopPilot backend, APIs, authentication, database, and business logic wherever possible**.

---

## 1. FIRST: ANALYZE THE EXISTING SHOPPILOT PROJECT

Before making any changes or writing mobile code, inspect the complete existing ShopPilot project.

Understand:

* Existing frontend technology
* Existing backend technology
* Node.js / Express structure
* MongoDB/Mongoose models
* Existing REST APIs
* Authentication and authorization
* User roles
* Product management
* Inventory management
* Orders
* Customers
* Dashboard
* Sales
* Reports
* Notifications
* Image/file uploads
* Existing validation
* Existing middleware
* Existing error handling
* Existing environment variables
* Existing API URL configuration

Study the existing code carefully.

Do not assume how the system works.

Do not duplicate existing backend functionality unless absolutely necessary.

---

# 2. MOBILE TECHNOLOGY

Create the mobile application using:

* React Native
* Expo
* Expo Router for navigation
* JavaScript or TypeScript based on the existing project's conventions
* Axios for API communication
* Secure storage for authentication credentials/tokens
* React Native compatible UI components
* Appropriate libraries for device-specific functionality

The application must support:

* Android
* iOS

Do not create a mobile website.

Do not simply wrap the existing website inside a WebView.

The result must be a genuine React Native mobile application.

---

# 3. PROJECT STRUCTURE

Create the mobile application separately from the existing web application.

Recommended structure:

ShopPilot/

├── backend/                 # EXISTING — DO NOT BREAK
│
├── frontend/                # EXISTING WEB APP — DO NOT BREAK
│
├── mobile/                  # NEW React Native application
│   ├── app/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── assets/
│   └── package.json
│
└── README.md

If the existing repository uses a different structure, preserve the existing architecture and adapt accordingly.

---

# 4. DO NOT BREAK THE EXISTING WEB APP

This is extremely important.

The existing ShopPilot website is already completed.

Do NOT:

* Delete existing files
* Rewrite the existing frontend
* Change existing UI unnecessarily
* Remove existing features
* Modify working backend logic unnecessarily
* Change database schemas unnecessarily
* Break existing API endpoints
* Change production behavior
* Replace the web application with React Native

The mobile application must be developed alongside the existing web application.

---

# 5. REUSE THE EXISTING BACKEND

The mobile application should communicate with the existing ShopPilot backend.

Architecture:

Mobile App
↓
Existing REST API
↓
Node.js + Express
↓
MongoDB

The existing web application should continue using:

Web App
↓
Existing REST API
↓
Node.js + Express
↓
MongoDB

Both applications must use the same backend and database.

Do NOT create:

Mobile App → New Backend → New Database

unless the existing architecture makes something technically unavoidable.

---

# 6. CREATE A MOBILE API SERVICE

Create a centralized API layer.

For example:

mobile/
└── services/
├── api.js
├── authService.js
├── productService.js
├── inventoryService.js
├── orderService.js
└── userService.js

Use a centralized Axios instance.

The API base URL must be configurable using environment variables.

Development:

http://YOUR_LOCAL_NETWORK_IP:PORT/api

Production:

https://YOUR_PRODUCTION_API/api

Do not hardcode localhost in production.

---

# 7. AUTHENTICATION

Analyze the authentication mechanism already implemented in ShopPilot.

Reuse the existing authentication system.

The mobile application should support the same appropriate authentication flow as the web application.

Implement:

* Login
* Logout
* Session/token persistence
* Authentication state
* Protected screens
* Automatic authentication restoration
* Unauthorized request handling
* Token expiration handling

For mobile, use secure device storage rather than browser localStorage.

For example, use Expo SecureStore when appropriate.

The user should not have to log in every time they open the application unless the existing authentication/security design requires it.

---

# 8. MOBILE NAVIGATION

Design navigation specifically for mobile.

Do NOT simply copy the desktop navbar/sidebar.

Use appropriate mobile navigation such as:

Bottom Tab Navigation:

Home
Products
Inventory
Orders
Profile

And stack navigation for deeper screens.

Example:

Home
├── Notifications
├── Sales Details
└── Dashboard Details

Products
├── Product List
├── Product Details
├── Add Product
└── Edit Product

Inventory
├── Stock
├── Low Stock
└── Stock Details

Orders
├── Order List
├── Order Details
└── Update Order

Profile
├── Account
├── Settings
└── Logout

Adapt this structure according to the actual ShopPilot features discovered in the existing project.

---

# 9. MOBILE DASHBOARD

Create a mobile-friendly ShopPilot dashboard.

It should provide important information at a glance.

Possible sections:

* Today's sales
* Total sales
* Orders
* Pending orders
* Products
* Low-stock products
* Customers
* Recent orders
* Important notifications

Use cards, lists, charts, and appropriate mobile layouts.

Do not overcrowd the dashboard.

Prioritize information that is useful on a phone.

---

# 10. PRODUCT MANAGEMENT

If the existing ShopPilot system supports product management, implement the appropriate mobile functionality.

Possible features:

* View products
* Search products
* Filter products
* Product details
* Product images
* Product price
* Product stock
* Categories
* Add product
* Edit product
* Delete product
* Product status

Use the existing API endpoints and models.

---

# 11. INVENTORY MANAGEMENT

If inventory functionality exists, make it mobile-friendly.

Provide:

* Current stock
* Low-stock products
* Out-of-stock products
* Stock details
* Stock updates
* Inventory search
* Inventory filtering
* Product availability

Consider adding barcode/QR scanning if it fits the existing ShopPilot business model.

If barcode scanning is appropriate, implement it using a proper React Native/Expo camera scanning solution.

Do not add unnecessary features without first understanding the existing ShopPilot functionality.

---

# 12. ORDER MANAGEMENT

Implement mobile order management according to the existing ShopPilot features.

Include where applicable:

* Order list
* Order details
* Customer information
* Products in order
* Quantity
* Price
* Total amount
* Order status
* Date/time
* Payment status
* Update order status

Use a mobile-friendly order detail screen.

---

# 13. CUSTOMER MANAGEMENT

If ShopPilot has customer management:

Create mobile screens for:

* Customer list
* Search customers
* Customer details
* Customer orders
* Customer contact information
* Customer activity where supported

Use appropriate mobile interactions.

---

# 14. SEARCH AND FILTERING

Implement mobile-friendly:

* Search bars
* Filters
* Sorting
* Category filters
* Status filters
* Date filters where relevant

Avoid huge desktop-style filter panels.

Use mobile bottom sheets/modals where appropriate.

---

# 15. RESPONSIVE MOBILE UI

The application must work properly on different screen sizes.

Support:

* Small Android phones
* Large Android phones
* iPhones
* Different aspect ratios
* Safe areas
* Different screen densities

Do not use fixed dimensions everywhere.

Use responsive layouts.

Respect:

* SafeArea
* Status bar
* Navigation areas
* Keyboard
* Device orientation where appropriate

---

# 16. UI/UX DESIGN

The mobile application should feel like a professional production application.

Design goals:

* Clean
* Modern
* Fast
* Minimal
* Business-oriented
* Easy to navigate
* Consistent
* Accessible

Use the ShopPilot brand identity from the existing web application.

Analyze the existing web application's:

* Logo
* Typography
* Colors
* Buttons
* Cards
* Icons
* Branding

Use these as inspiration, but redesign the interface specifically for mobile.

Do not simply shrink the website.

---

# 17. LOADING STATES

Every API-driven screen should properly handle:

* Initial loading
* Refreshing
* Pagination loading
* Empty states
* Error states
* Retry states

Example:

Loading:

"Loading products..."

Empty:

"No products found."

Error:

"Unable to load products."

Button:

"Retry"

Do not leave blank screens when an API request fails.

---

# 18. ERROR HANDLING

Implement centralized error handling.

Handle:

* Network errors
* Server errors
* Unauthorized errors
* Expired authentication
* Validation errors
* Timeout
* No internet connection

Show useful user-friendly messages.

Do not expose raw backend errors to users.

---

# 19. OFFLINE SUPPORT

Analyze whether ShopPilot would benefit from offline functionality.

If appropriate, implement a basic offline-first strategy for important mobile operations.

For example:

Internet available
↓
Fetch data
↓
Store necessary data locally
↓
Internet disconnected
↓
Display cached information
↓
Internet returns
↓
Synchronize data

Do not implement complicated synchronization unless required.

First ensure the normal online application works correctly.

---

# 20. MOBILE-SPECIFIC FEATURES

After implementing the core features, identify features that would provide genuine value on mobile.

Potential features:

* Barcode scanning
* QR scanning
* Camera
* Push notifications
* Local notifications
* Biometric authentication
* Share functionality
* Deep links
* Phone/email actions
* Offline mode
* Pull-to-refresh

Only implement features that make sense for ShopPilot.

Do not add random features just to make the app larger.

---

# 21. PERFORMANCE

The mobile app should be optimized for real devices.

Pay attention to:

* Large product lists
* Images
* API requests
* Unnecessary re-renders
* Navigation performance
* Memory usage
* List virtualization
* Image caching
* Pagination

Use FlatList or appropriate optimized list components instead of rendering huge arrays directly.

---

# 22. SECURITY

Follow secure mobile development practices.

Do not:

* Hardcode secrets
* Store passwords
* Store sensitive tokens in plain AsyncStorage when secure storage is appropriate
* Expose MongoDB credentials
* Expose backend secrets
* Put private API keys directly into source code

The mobile application must communicate only with the backend.

Never connect the mobile application directly to MongoDB.

Correct:

Mobile
↓
Express API
↓
MongoDB

Incorrect:

Mobile
↓
MongoDB

---

# 23. ENVIRONMENT CONFIGURATION

Create proper environment configuration.

Development:

API_URL=http://YOUR_LOCAL_IP:PORT/api

Production:

API_URL=https://YOUR_PRODUCTION_API/api

Make it easy to switch environments.

Do not commit secrets to GitHub.

Create an appropriate `.env.example`.

---

# 24. TESTING

After implementation, test the application on:

* Android emulator
* Physical Android device if available
* iOS simulator if available
* Different screen sizes

Test:

* Registration
* Login
* Logout
* Authentication persistence
* Dashboard
* Products
* Inventory
* Orders
* Customers
* Profile
* API failures
* Network failure
* Token expiration
* Image loading
* Navigation
* Back button
* Keyboard behavior

Fix all runtime errors.

---

# 25. BUILD CONFIGURATION

Configure the Expo project properly for:

Android:

* Application/package identifier
* App name
* App icon
* Splash screen
* Permissions

iOS:

* Bundle identifier
* App name
* App icon
* Splash screen
* Required permissions

Use a professional application name:

ShopPilot

Ensure the final application can eventually be built as:

Android:
APK / AAB

iOS:
IPA / App Store build

---

# 26. DO NOT STOP AFTER CREATING THE BASIC UI

The goal is NOT to generate static screens.

Every important screen should be connected to the real ShopPilot backend.

For example:

Product screen
↓
Real API
↓
Real MongoDB data

Order screen
↓
Real API
↓
Real MongoDB data

Dashboard
↓
Real API
↓
Real ShopPilot statistics

Do not use fake JSON data when a real API already exists.

---

# 27. DEVELOPMENT APPROACH

Follow this sequence:

PHASE 1
Analyze existing ShopPilot

↓

PHASE 2
Create Expo mobile application

↓

PHASE 3
Configure navigation

↓

PHASE 4
Configure API service

↓

PHASE 5
Implement authentication

↓

PHASE 6
Implement dashboard

↓

PHASE 7
Implement core ShopPilot features

↓

PHASE 8
Add mobile-specific functionality

↓

PHASE 9
Improve UI/UX

↓

PHASE 10
Testing and bug fixing

↓

PHASE 11
Android/iOS build configuration

---

# 28. IMPORTANT DEVELOPMENT RULE

Before modifying anything:

UNDERSTAND THE EXISTING CODE.

Do not guess.

Do not replace working implementations unnecessarily.

Do not create duplicate business logic.

Do not create a second database.

Do not create a second authentication system.

Do not break the existing web application.

Reuse the existing ShopPilot backend and APIs wherever possible.

---

# 29. FINAL EXPECTATION

At the end, ShopPilot should have:

```
                ShopPilot
                    │
      ┌─────────────┴─────────────┐
      │                           │
 🌐 Web App                  📱 Mobile App
 Existing                   NEW React Native
      │                           │
      └─────────────┬─────────────┘
                    │
              Existing API
                    │
             Node + Express
                    │
                 MongoDB
```

The existing web application must continue working exactly as before.

The new mobile application must provide a polished, native-feeling Android/iOS experience using the same ShopPilot backend and data.

Before finishing, review the entire mobile implementation for:

* Runtime errors
* Navigation errors
* API errors
* Authentication errors
* UI issues
* Responsive issues
* Security issues
* Performance problems
* Android compatibility
* iOS compatibility

Then provide a final summary containing:

1. What was implemented
2. New files/folders created
3. Existing APIs reused
4. New dependencies installed
5. Environment variables required
6. How to run the Android app
7. How to run the iOS app
8. How to create production builds
9. Any backend changes required
10. Any remaining limitations

Do not modify or remove completed ShopPilot web functionality unless absolutely necessary and explicitly explain any required backend changes.
