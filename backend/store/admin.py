
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Category, Product, ProductImage, Customer, Order, OrderItem, Delivery

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'is_primary', 'order')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'stock_quantity', 'is_active', 'featured', 'created_at')
    list_filter = ('category', 'brand', 'is_active', 'featured', 'created_at')
    search_fields = ('name', 'brand', 'description')
    list_editable = ('price', 'stock_quantity', 'is_active', 'featured')
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'brand', 'category', 'price', 'description')
        }),
        ('Product Details', {
            'fields': ('specifications', 'sizes', 'colors', 'stock_quantity')
        }),
        ('Status', {
            'fields': ('is_active', 'featured')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('images')

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'is_primary', 'order')
    list_filter = ('is_primary', 'product__category')
    search_fields = ('product__name', 'alt_text')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Preview"

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'city', 'state', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    list_filter = ('state', 'country', 'created_at')
    readonly_fields = ('created_at',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'payment_status', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at', 'shipped_at')
    search_fields = ('order_number', 'customer__first_name', 'customer__last_name', 'customer__email')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'customer', 'status', 'payment_status')
        }),
        ('Financial Details', {
            'fields': ('total_amount', 'shipping_cost', 'tax_amount')
        }),
        ('Shipping Information', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_state', 'shipping_zip_code', 'shipping_country')
        }),
        ('Tracking', {
            'fields': ('tracking_number', 'shipped_at', 'delivered_at')
        }),
        ('Additional Info', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('customer')

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'order', 'delivery_service', 'status', 'estimated_delivery', 'actual_delivery')
    list_filter = ('status', 'delivery_service', 'created_at')
    search_fields = ('tracking_number', 'order__order_number', 'order__customer__email')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Delivery Information', {
            'fields': ('order', 'delivery_service', 'tracking_number', 'status')
        }),
        ('Timeline', {
            'fields': ('estimated_delivery', 'actual_delivery')
        }),
        ('Notes', {
            'fields': ('delivery_notes', 'created_at', 'updated_at')
        }),
    )

# Customize admin interface
admin.site.site_header = "LUXE E-commerce Admin"
admin.site.site_title = "LUXE Admin Portal"
admin.site.index_title = "Welcome to LUXE Administration"
