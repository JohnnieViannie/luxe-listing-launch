
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Order, Customer, Delivery
from .serializers import (
    ProductSerializer, CategorySerializer, OrderSerializer,
    CustomerSerializer, DeliverySerializer
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related('images')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'featured']
    search_fields = ['name', 'description', 'brand']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.queryset.filter(featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related('customer').prefetch_related('items__product')
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status']
    ordering = ['-created_at']

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email']

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().select_related('order__customer')
    serializer_class = DeliverySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'delivery_service']
