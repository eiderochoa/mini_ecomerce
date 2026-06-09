import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { type Producto } from '../types/ecommerce';

export const ProductoCard = ({ producto }: { producto: Producto }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  // 1. Lógica Senior para determinar el estado del inventario
  const stockNum = Number(producto.stock);
  const estaAgotado = stockNum === 0;
  const esCasiAgotado = stockNum > 0 && stockNum <= 5; // Cambia el 5 por el umbral que prefieras

  const handleAdd = async () => {
    try {
      setIsAdding(true);
      await addToCart(producto.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <div className="relative h-48 w-full bg-gray-50">
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
          )}
          
          {/* 2. Badge Dinámico basado en los 3 estados de stock */}
          {estaAgotado ? (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm bg-red-100 text-red-800 border border-red-200">
              Agotado
            </span>
          ) : esCasiAgotado ? (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
              ⚠️ ¡Últimas unidades!
            </span>
          ) : (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm bg-green-100 text-green-800 border border-green-200">
              Disponible
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{producto.nombre}</h3>
            <span className="text-sm text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              {producto.sku}
            </span>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{producto.descripcion || 'Sin descripción.'}</p>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between mt-auto">
        <span className="text-xl font-black text-gray-900">${Number(producto.precio).toFixed(2)}</span>
        <button
          onClick={handleAdd}
          disabled={estaAgotado || isAdding}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            estaAgotado 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : esCasiAgotado
                ? 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isAdding ? 'Añadiendo...' : 'Añadir'}
        </button>
      </div>
    </div>
  );
};