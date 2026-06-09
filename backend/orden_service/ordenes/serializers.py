from rest_framework import serializers
from .models import Orden, OrdenDetail

class OrdenDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenDetail
        fields = ['producto_id', 'nombre_producto', 'precio_unitario', 'cantidad']

class OrdenSerializer(serializers.ModelSerializer):
    detalles = OrdenDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Orden
        fields = ['id', 'usuario_id', 'total', 'detalles', 'creado_en']
        read_only_fields = ['total', 'usuario_id']