from rest_framework import serializers
import requests
from .models import CartItem

class CartItemSerializer(serializers.ModelSerializer):
    # Campos adicionales que no están en la Base de Datos local del carrito
    nombre_producto = serializers.SerializerMethodField()
    precio_producto = serializers.SerializerMethodField()
    imagen_producto = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'usuario_id', 'producto_id', 'cantidad', 
            'nombre_producto', 'precio_producto', 'imagen_producto', 'subtotal'
        ]
        read_only_fields = ['usuario_id'] # Se asigna automáticamente en la vista

    # Método auxiliar para consultar al microservicio de productos
    def _get_producto_data(self, obj):
        try:
            # Consumimos internamente el puerto 8001
            response = requests.get(f"http://127.0.0.1:8001/api/productos/{obj.producto_id}/", timeout=2)
            if response.status_code == 200:
                return response.json()
        except requests.exceptions.RequestException:
            pass
        return None

    def get_nombre_producto(self, obj):
        data = self._get_producto_data(obj)
        return data.get('nombre', 'Producto No Disponible') if data else 'Error de conexión'

    def get_precio_producto(self, obj):
        data = self._get_producto_data(obj)
        return float(data.get('precio', 0.00)) if data else 0.00

    def get_imagen_producto(self, obj):
        data = self._get_producto_data(obj)
        return data.get('imagen', None) if data else None

    def get_subtotal(self, obj):
        precio = self.get_precio_producto(obj)
        return round(precio * obj.cantidad, 2)