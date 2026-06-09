import { useCart } from '../context/CartContext';

export const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, checkout, loading, updateQuantity } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-500 text-2xl font-light">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">El carrito está vacío.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                  
                  {/* Info e Imagen del Producto */}
                  <div className="flex items-center space-x-4 flex-1">
                    {item.imagen_producto && (
                      <img src={item.imagen_producto} alt={item.nombre_producto} className="w-14 h-14 object-cover rounded-md border bg-gray-50 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{item.nombre_producto}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">${Number(item.precio_producto).toFixed(2)} c/u</p>
                    </div>
                  </div>

                  {/* Selector de Cantidades Responsive & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-6 w-full sm:w-auto">
                    
                    {/* Botonera de +/- */}
                    <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        className="px-2 py-1 text-gray-500 hover:text-blue-600 font-bold disabled:text-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        &minus;
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-800 min-w-[20px] text-center">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="px-2 py-1 text-gray-500 hover:text-blue-600 font-bold transition-colors text-sm"
                      >
                        &#43;
                      </button>
                    </div>

                    {/* Costos y Acción de Borrado */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-black text-gray-900 block">
                        ${Number(item.subtotal).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors mt-0.5 block ml-auto"
                      >
                        Eliminar
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer fijo del Carrito */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-base font-bold text-gray-900 mb-4">
                <span>Total Estimado:</span>
                <span className="text-xl font-black">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={checkout}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition-colors duration-200 disabled:bg-gray-400"
              >
                {loading ? 'Procesando Orden...' : 'Confirmar Compra'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};