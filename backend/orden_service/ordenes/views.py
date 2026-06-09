from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
import requests
from .models import Orden, OrdenDetail
from .serializers import OrdenSerializer

class OrdenViewSet(viewsets.ModelViewSet):
    serializer_class = OrdenSerializer
    
    def get_queryset(self):
        return Orden.objects.filter(usuario_id=1).order_by('-creado_en')

    def create(self, request, *args, **kwargs):
        usuario_id = 1
        
        # 1. Consultar el carrito al Servicio de Carrito (Puerto 8002)
        try:
            carrito_res = requests.get(f"http://127.0.0.1:8002/api/carrito/", timeout=3)
            if carrito_res.status_code != 200:
                return Response({"error": "No se pudo conectar con el servicio de carrito"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            items_carrito = carrito_res.json()
        except requests.exceptions.RequestException:
            return Response({"error": "Servicio de carrito fuera de línea"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if not items_carrito:
            return Response({"error": "El carrito está vacío. No se puede generar una orden."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Operación Atómica para resguardar la Orden y el Inventario
        try:
            with transaction.atomic():
                orden = Orden.objects.create(usuario_id=usuario_id)
                total_orden = 0
                
                for item in items_carrito:
                    p_id = item['producto_id']
                    cant = item['cantidad']
                    
                    # === NUEVO: Comunicación síncrona para descontar stock ===
                    stock_res = requests.post(
                        f"http://127.0.0.1:8001/api/productos/{p_id}/descontar_stock/",
                        json={"cantidad": cant},
                        timeout=3
                    )
                    
                    # Si el Servicio de Productos rechaza la compra (ej. sin stock), abortamos todo
                    if stock_res.status_code != 200:
                        error_msg = stock_res.json().get('error', 'Error desconocido en inventario')
                        # Forzamos un RuntimeException para gatillar el ROLLBACK automático de la orden
                        raise Exception(f"Inventario rechazó la operación: {error_msg}")
                    
                    # Si el stock se descontó bien, procedemos a congelar los datos en el detalle
                    subtotal = float(item['subtotal'])
                    total_orden += subtotal
                    
                    OrdenDetail.objects.create(
                        orden=orden,
                        producto_id=p_id,
                        nombre_producto=item['nombre_producto'],
                        precio_unitario=item['precio_producto'],
                        cantidad=cant
                    )
                
                orden.total = total_orden
                orden.save()

                # 3. Vaciar el carrito en el microservicio correspondiente (Solo si todo lo anterior fue exitoso)
                for item in items_carrito:
                    requests.delete(f"http://127.0.0.1:8002/api/carrito/{item['id']}/", timeout=2)

                serializer = self.get_serializer(orden)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Capturamos el error (ya sea por fallo de red o por stock insuficiente)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)