import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { carritoApi, ordenesApi } from '../api/ecommerceApi';
import type { CartItem, Orden } from '../types/ecommerce';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productoId: number, cantidad?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  checkout: () => Promise<void>;
  updateQuantity: (itemId: number, nuevaCantidad: number) => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCart = async () => {
    try {
      const res = await carritoApi.get<CartItem[]>('/carrito/');
      setCartItems(res.data);
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productoId: number, cantidad: number = 1) => {
    try {
      await carritoApi.post('/carrito/', { producto_id: productoId, cantidad });
      await fetchCart(); 
    } catch (err) {
      alert("Error al añadir el producto al carrito.");
      throw err;
    } 
  };

  const updateQuantity = async (itemId: number, nuevaCantidad: number) => {
  // Regala una capa de protección: si la cantidad baja de 1, no hacemos nada 
  // (o podrías llamar a removeFromCart si prefieres que se borre automáticamente)
  if (nuevaCantidad < 1) return;

  try {
    // Enviamos un PATCH parcial al puerto 8002 con la nueva cantidad exacta
    await carritoApi.patch(`/carrito/${itemId}/`, { cantidad: nuevaCantidad });
    await fetchCart(); // Recargamos para obtener los subtotales e hidratación fresca
  } catch (err) {
    console.error("Error al actualizar la cantidad:", err);
    alert("No se pudo actualizar la cantidad en el servidor.");
  }
};

  const removeFromCart = async (itemId: number) => {
    try {
      await carritoApi.delete(`/carrito/${itemId}/`);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Error al eliminar item del carrito:", err);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      const res = await ordenesApi.post<Orden>('/ordenes/');
      alert(`¡Orden #${res.data.id} creada con éxito! El inventario ha sido actualizado.`);
      setCartItems([]); 
      setIsCartOpen(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error al procesar la orden";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (Number(item.precio_producto) * item.cantidad), 0);

  return (
    <CartContext.Provider value={{
      cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, checkout, updateQuantity, cartCount, cartTotal, loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};