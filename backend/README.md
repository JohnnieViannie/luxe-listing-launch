
# LUXE E-commerce Django Admin Dashboard

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create Admin User & Sample Data**
   ```bash
   python setup_admin.py
   ```

4. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

5. **Access Admin Dashboard**
   - URL: http://127.0.0.1:8000/admin/
   - Username: admin
   - Password: admin123

## Features

### Product Management
- Add/edit products with multiple images
- Set specifications, sizes, and colors
- Manage inventory and pricing
- Featured product selection

### Order Management
- View and manage all orders
- Update order status and payment status
- Track shipping information
- Add tracking numbers

### Customer Management
- Customer profiles and contact information
- Order history per customer
- Search and filter customers

### Delivery Management
- Track deliveries and shipments
- Update delivery status
- Manage tracking numbers
- Delivery service assignments

## API Endpoints

- Products: http://127.0.0.1:8000/api/products/
- Orders: http://127.0.0.1:8000/api/orders/
- Customers: http://127.0.0.1:8000/api/customers/
- Deliveries: http://127.0.0.1:8000/api/deliveries/

## Integration with React Frontend

The API is configured with CORS to work with your React app running on localhost:5173.

To integrate with your existing React app, update your product fetching to use:
`http://127.0.0.1:8000/api/products/`
