// src/views/CatalogView.tsx
import { useState, useEffect } from 'react';
import { productosApi } from '../api/ecommerceApi';
import { ProductoCard } from '../components/ProductoCard';
import { type Producto } from '../types/ecommerce';

export const CatalogView = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const res = await productosApi.get<Producto[]>('/productos/');
        setProductos(res.data);
      } catch (err) {
        setError("No se pudo conectar con el catálogo de productos.");
      }
    };
    loadProductos();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 sm:text-3xl tracking-tight">Nuestro Catálogo</h2>
        <p className="text-gray-500 text-sm mt-1">Explora los productos disponibles en nuestro ecosistema de microservicios.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm text-center font-medium my-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((prod) => (
          <ProductoCard key={prod.id} producto={prod} />
        ))}
      </div>
    </main>
  );
};