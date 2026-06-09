from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import CartItem
from .serializers import CartItemSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    """
    Endpoints para la gestión del carrito de compras.
    Permite listar los ítems, añadir productos, modificar cantidades y remover elementos.
    """
    serializer_class = CartItemSerializer

    def get_queryset(self):
        # Por ahora filtramos por el usuario simulado id=1 para el frontend
        return CartItem.objects.filter(usuario_id=1)

    def create(self, request, *args, **kwargs):
        producto_id = request.data.get('producto_id')
        cantidad = int(request.data.get('cantidad', 1))
        usuario_id = 1 # Usuario harcodeado para la prueba

        # Validación: Si el ítem ya existe en el carrito, se incrementa la cantidad
        item, creado = CartItem.objects.get_or_create(
            usuario_id=usuario_id,
            producto_id=producto_id,
            defaults={'cantidad': cantidad}
        )
        
        if not creado:
            item.cantidad += cantidad
            item.save()

        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)