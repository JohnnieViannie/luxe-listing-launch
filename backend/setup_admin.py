
#!/usr/bin/env python
import os
import sys
import django
from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line

def setup():
    """Setup Django admin with sample data"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_admin.settings')
    django.setup()
    
    # Create superuser
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@luxe.com', 'admin123')
        print("Admin user created: username=admin, password=admin123")
    
    # Import models and create sample data
    from store.models import Category, Product, ProductImage, Customer, Order, OrderItem
    
    # Create categories
    categories_data = [
        {'name': 'Women', 'slug': 'women', 'description': 'Women\'s fashion and accessories'},
        {'name': 'Men', 'slug': 'men', 'description': 'Men\'s fashion and accessories'},
        {'name': 'Beauty', 'slug': 'beauty', 'description': 'Beauty and cosmetic products'},
    ]
    
    for cat_data in categories_data:
        Category.objects.get_or_create(**cat_data)
    
    print("Sample categories created")
    print("Django admin setup complete!")
    print("Run: python manage.py runserver")
    print("Access admin at: http://127.0.0.1:8000/admin/")

if __name__ == '__main__':
    setup()
