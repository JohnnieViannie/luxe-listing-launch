
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
    queryset = Product.objects.all().prefetch_related('images')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'featured', 'status', 'visibility']
    search_fields = ['name', 'description', 'brand', 'tags']
    ordering_fields = ['price', 'created_at', 'name', 'stock_quantity']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by visibility and status if needed
        if self.action == 'list':
            # Only show published and public products in list view by default
            return queryset.filter(status='published', visibility='public', is_active=True)
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(
            featured=True, status='published', is_active=True
        )
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def admin_list(self, request):
        """Get all products for admin panel (regardless of status/visibility)"""
        all_products = Product.objects.all().prefetch_related('images')
        serializer = self.get_serializer(all_products, many=True)
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
