## 🚀 Live Demo

- **(Vercel):** [https://product-management-portal-aman.vercel.app](https://product-management-portal-aman.vercel.app)  


# Node.js E-commerce Application

This is a Node.js-based e-commerce application that provides functionality for managing products, categories, and customers. It includes both admin and customer interfaces.

## Features

- **Admin Panel**:
  - Manage categories (add, edit, list, discard)
  - Manage products (add, edit, list, discard)
  - View admin dashboard

- **Customer Interface**:
  - Browse products
  - View product details
  - Customer dashboard

## Project Structure

- `index.js`: Entry point of the application.
- `app/`: Contains the core application logic.
  - `config/`: Database configuration.
  - `controller/`: Controllers for handling requests (Admin, Category, Customer, Home, Product).
  - `helper/`: Helper functions (e.g., image upload).
  - `middleware/`: Middleware for request handling.
  - `model/`: Database models (e.g., category, product).
  - `routes/`: Application routes (admin, customer, general router).
- `public/`: Public assets.
- `uploads/`: Uploaded images.
- `views/`: EJS templates for rendering views.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd assement-2-aman
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

## Environment Variables

Ensure you set up the required environment variables in a `.env` file or directly in Vercel:

- `DB_HOST`: Database host
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## License

This project is licensed under the MIT License.