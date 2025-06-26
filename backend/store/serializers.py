
from rest_framework import serializers
from .models import Product, Category, Order, Customer, Delivery, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    price_ugx = serializers.ReadOnlyField()
    discount_price_ugx = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'category', 'price', 'price_ugx',
            'discount_price', 'discount_price_ugx', 'description', 
            'specifications', 'sizes', 'colors', 'tags', 'stock_quantity',
            'is_active', 'featured', 'status', 'visibility', 'video_url',
            'weight', 'length', 'width', 'height', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # Ensure that published products are active
        if validated_data.get('status') == 'published':
            validated_data['is_active'] = True
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ensure that published products are active
        if validated_data.get('status') == 'published':
            validated_data['is_active'] = True
        elif validated_data.get('status') in ['draft', 'hidden']:
            validated_data['is_active'] = False
        return super().update(instance, validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'size', 'color', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'customer_name', 'status', 'payment_status',
            'total_amount', 'shipping_cost', 'tax_amount', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_zip_code', 'shipping_country',
            'tracking_number', 'shipped_at', 'delivered_at', 'notes', 'created_at',
            'updated_at', 'items'
        ]

class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'phone',
            'address', 'city', 'state', 'zip_code', 'country', 'created_at'
        ]

class DeliverySerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    customer_name = serializers.CharField(source='order.customer.full_name', read_only=True)
    
    class Meta:
        model = Delivery
        fields = [
            'id', 'order', 'order_number', 'customer_name', 'delivery_service',
            'tracking_number', 'status', 'estimated_delivery', 'actual_delivery',
            'delivery_notes', 'created_at', 'updated_at'
        ]
