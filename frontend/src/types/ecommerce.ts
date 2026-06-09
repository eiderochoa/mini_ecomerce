export interface Producto {
  id: number;
  nombre: string;
  sku: string;
  precio: string | number;
  stock: number;
  imagen: string | null;
  descripcion?: string;
  activo: boolean;
}

export interface CartItem {
  id: number;
  usuario_id: number;
  producto_id: number;
  cantidad: number;
  nombre_producto: string;
  precio_producto: number;
  imagen_producto: string | null;
  subtotal: number;
}

export interface OrdenDetail {
  producto_id: number;
  nombre_producto: string;
  precio_unitario: string | number;
  cantidad: number;
}

export interface Orden {
  id: number;
  usuario_id: number;
  total: string | number;
  detalles: OrdenDetail[];
  creado_en: string;
}