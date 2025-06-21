
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, OrderViewSet, CustomerViewSet, DeliveryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'deliveries', DeliveryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
