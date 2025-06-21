
from rest_framework import serializers
from .models import Product, ProductImage, Category, Order, OrderItem, Customer, Delivery

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'category', 'price', 'description',
            'specifications', 'sizes', 'colors', 'stock_quantity',
            'is_active', 'featured', 'images', 'created_at'
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone',
            'address', 'city', 'state', 'zip_code', 'country', 'created_at'
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'size', 'color', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'status', 'payment_status',
            'total_amount', 'shipping_cost', 'tax_amount', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_zip_code', 'shipping_country',
            'tracking_number', 'shipped_at', 'delivered_at', 'items', 'created_at'
        ]

class DeliverySerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    
    class Meta:
        model = Delivery
        fields = [
            'id', 'order', 'delivery_service', 'tracking_number', 'status',
            'estimated_delivery', 'actual_delivery', 'delivery_notes', 'created_at'
        ]
