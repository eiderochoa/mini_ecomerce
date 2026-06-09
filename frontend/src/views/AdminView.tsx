import { useState, type ChangeEvent } from 'react';
import { productosApi } from '../api/ecommerceApi';

interface AdminViewProps {
  onProductoCreado: () => void;
}

export const AdminView = ({ onProductoCreado }: AdminViewProps) => {
  const [nombre, setNombre] = useState('');
  const [sku, setSku] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null); 
  const [loading, setLoading] = useState(false);

  // Manejador seguro para capturar el archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || !sku || !precio || !stock) {
      alert("Por favor, llena todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

     
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('sku', sku);
      formData.append('precio', parseFloat(precio).toString());
      formData.append('stock', parseInt(stock, 10).toString());
      formData.append('descripcion', descripcion);
      formData.append('activo', 'true');
      
      // Solo adjuntamos la imagen si el usuario seleccionó una
      if (imagen) {
        formData.append('imagen', imagen);
      }

      // Enviamos el formData. Axios configurará automáticamente el Content-Type correcto
      await productosApi.post('/productos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("¡Producto con imagen inyectado con éxito!");
      
      // Limpiar formulario
      setNombre('');
      setSku('');
      setPrecio('');
      setStock('');
      setDescripcion('');
      setImagen(null);
      
      onProductoCreado();
    } catch (err) {
      console.error(err);
      alert("Error al inyectar el producto con imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-6 my-8">
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900">🛠️ Panel de Inyección Rápida (QA)</h3>
        <p className="text-sm text-gray-500 mt-1">
          Crea productos multimedia en tiempo real para verificar los estados de los badges e imágenes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nombre del Producto *</label>
            <input 
              type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Teclado Premium" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">SKU Único *</label>
            <input 
              type="text" value={sku} onChange={(e) => setSku(e.target.value)}
              placeholder="Ej. TEC-002" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Precio ($) *</label>
            <input 
              type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)}
              placeholder="89.99" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Stock de Prueba *</label>
            <input 
              type="number" value={stock} onChange={(e) => setStock(e.target.value)}
              placeholder="Ej. 3" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Imagen del Producto</label>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm flex items-center justify-between">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {imagen && (
              <span className="text-xs text-green-600 font-medium truncate max-w-[200px]">
                📸 {imagen.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Descripción corta</label>
          <textarea 
            rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles del artículo..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl shadow transition-colors text-sm disabled:bg-gray-400"
        >
          {loading ? 'Subiendo e Inyectando...' : 'Agregar al Catálogo con Imagen'}
        </button>
      </form>
    </div>
  );
};