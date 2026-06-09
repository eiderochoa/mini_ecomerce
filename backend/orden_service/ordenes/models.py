from django.db import models

class Orden(models.Model):
    usuario_id = models.IntegerField(default=1) # Simulación de usuario
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Orden #{self.id} - Usuario {self.usuario_id} - Total: ${self.total}"

class OrdenDetail(models.Model):
    orden = models.ForeignKey(Orden, related_name='detalles', on_delete=models.CASCADE)
    producto_id = models.IntegerField()
    # Datos históricos congelados 
    nombre_producto = models.CharField(max_length=255)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.nombre_producto} x {self.cantidad} (Orden #{self.orden.id})"