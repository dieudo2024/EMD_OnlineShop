
# 🛒 E-Commerce Web Application Capstone Project

 Shopping Web Applications

This project is a fully functional, frontend-only e-commerce web application built using React and modern styling techniques. It utilizes the public DummyJSON API for product data and manages user-specific data (cart, reviews) using Local Storage.

---

## 🚀 Deployment

The final version of this application is deployed and hosted on **Vercel**.

### Vercel Deployment Link:

[https://emd-online-shop.vercel.app/](https://emd-online-shop.vercel.app/)

---

## ⚙️ Setup Instructions

Follow these steps to set up the E-Commerce Web Application locally on your machine.

### Prerequisites

You must have the following software installed:

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager) or **Yarn**
* **Git** (for version control)

### Step 1: Clone the Repository

Clone this project repository to your local machine using Git:

```bash
git clone https://github.com/dieudo2024/EMD_OnlineShop.git 
cd emd_onlineshop
```
Step 2: Install Dependencies

Once inside the project directory, install all required dependencies (including React Router DOM).
sh
# Using npm
npm install

# OR using yarn
# yarn install

Step 3: Run the Development Server

Start the application in development mode. The app will typically be accessible at the address shown in your terminal (e.g., http://localhost:5173).

# Using npm
npm run dev

# OR using yarn
# yarn dev

Step 4: Data Source

This application fetches all product and category data from the public DummyJSON API:

    API Base URL: https://dummyjson.com

## Feature List (Functional Requirements)

The application implements all mandatory functional requirements for the capstone project.
1. Product Listings & Data Fetching

    API Integration: Fetches all product data from the DummyJSON API.

    Product Card: Each product displays the image, title, price (with discount if available), category, rating, and an "Add to Cart" button.

2. Product Detail Page

    Routing: Navigates to a specific detail page when a product card is clicked.

    Content: Displays high-resolution image, detailed description, ratings (stars + number), price, discounts, and the "Add to Cart" button.

3. Shopping Cart Management

    Functionality: Allows users to add and remove products, and increase or decrease item quantities.

    Persistence: Cart contents are saved and loaded using localStorage.

    Totals: Dynamic calculation and display of the subtotal and total item count.

4. Search, Filter & Sort

The application provides multiple ways to navigate and refine the product list:

    Search Bar: Filters products dynamically by product name/title.

    Category Filter: Allows filtering by specific product categories.

    Price Filter: Enables filtering products within a user-defined price range.

    Sorting: Includes options for sorting products (e.g., Price Low-High, Highest Rating).

5. Product Reviews

    Submission: Users can submit new reviews (rating, text, optional name).

    Data Handling: User-submitted reviews are persisted using localStorage.

    Display: Both API-provided reviews and user-submitted reviews are displayed on the Product Detail Page.

    Dynamic Rating: Average ratings are dynamically recalculated and updated across both the detail and listing pages.

6. Full Checkout & Payment Simulation (Mandatory)

A complete, simulated checkout flow is implemented:

Step,                Requirement,      Details
1. Tax Calculation   Required,        Applies GST (5% Canada) and QST (9.975% Quebec) if the                                        province/state field is set to 'Quebec'.
2. Shipping Address  Required,        "Form collects Name, Address, City, Province/State, and                                       Postal code."
3. Payment Method    Required,        "Simulation of method selection (Credit Card, PayPal,                                         Bank Transfer). No real payment processing is needed."
4. Order Confirmation,Required,      "A dedicated page displaying purchased products,                                               itemized totals (subtotal + taxes), final total,                                             shipping address, and the selected payment method."

7. Responsive UI

    The layout is fully responsive, ensuring optimal viewing and functionality on both mobile devices and desktop screens.

8. Routing

    Implemented using React Router DOM for the following distinct views: /, /product/:id, /cart, /checkout, and /order-confirmation.

9. Footer

    Includes quick links, placeholder social icons, and copyright information.

