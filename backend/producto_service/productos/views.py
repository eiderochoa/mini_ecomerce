from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Producto
from .serializers import ProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all() # Solo exponemos productos activos
    serializer_class = ProductoSerializer

    # NUEVA ACCIÓN: POST /api/productos/{id}/descontar_stock/
    @action(detail=True, methods=['post'])
    def descontar_stock(self, request, pk=None):
        producto = self.get_object()
        cantidad = int(request.data.get('cantidad', 0))

        if cantidad <= 0:
            return Response({"error": "La cantidad a descontar debe ser mayor a cero."}, status=status.HTTP_400_BAD_REQUEST)

        # Usamos select_for_update para bloquear la fila en la Base de Datos (Senior Lock)
        # Esto evita condiciones de carrera (Race Conditions) si dos usuarios compran el mismo producto a la vez
        with transaction.atomic():
            producto_bloqueado = Producto.objects.select_for_update().get(pk=producto.pk)
            
            if producto_bloqueado.stock < cantidad:
                return Response(
                    {"error": f"Stock insuficiente para {producto_bloqueado.nombre}. Disponible: {producto_bloqueado.stock}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Descontamos el stock
            producto_bloqueado.stock -= cantidad
            producto_bloqueado.save()

        return Response({"mensaje": "Stock descontado con éxito", "stock_restante": producto_bloqueado.stock}, status=status.HTTP_200_OK)
