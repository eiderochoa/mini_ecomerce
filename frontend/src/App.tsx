import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CatalogView } from './views/CatalogView';
import { CartSidebar } from './components/CartSidebar';
import { AdminView } from './views/AdminView';

function App() {
  const [currentView, setCurrentView] = useState<'catalogo' | 'admin'>('catalogo');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    // Incrementamos el key para forzar la recarga del componente CatalogView automáticamente
    setRefreshKey(prev => prev + 1);
    setCurrentView('catalogo');
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        
        {/* Sub-barra de navegación para Pruebas / QA */}
        <div className="bg-white border-b border-gray-200 py-2 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-4">
            <button
              onClick={() => setCurrentView('catalogo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${
                currentView === 'catalogo' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🛍️ Ver Tienda
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${
                currentView === 'admin' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🛠️ Inyectar Productos (QA)
            </button>
          </div>
        </div>

        {/* Renderizado Condicional de las Vistas */}
        {currentView === 'catalogo' ? (
          <CatalogView key={refreshKey} />
        ) : (
          <AdminView onProductoCreado={triggerRefresh} />
        )}

        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export default App;