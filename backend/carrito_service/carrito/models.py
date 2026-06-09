from django.db import models

class CartItem(models.Model):
    usuario_id = models.IntegerField(default=1) # Simulación de usuario para la SPA
    producto_id = models.IntegerField()         # Referencia al ID del otro microservicio
    cantidad = models.PositiveIntegerField(default=1)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        # Evita que un usuario tenga el mismo producto duplicado en filas distintas
        unique_together = ('usuario_id', 'producto_id') 

    def __str__(self):
        return f"Usuario {self.usuario_id} - Producto {self.producto_id} x {self.cantidad}"