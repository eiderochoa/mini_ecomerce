import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛒</span>
            <span className="font-black text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              MicroShop
            </span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
              TS v4
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-gray-400">Usuario de Prueba</span>
              <span className="text-sm font-bold text-gray-700">Senior Dev #1</span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gray-50 hover:bg-gray-100 p-2.5 rounded-full border border-gray-200 transition-colors duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};