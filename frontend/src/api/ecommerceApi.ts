import axios from 'axios';

const PORTS = {
  productos: 'http://127.0.0.1:8001/api',
  carrito: 'http://127.0.0.1:8002/api',
  ordenes: 'http://127.0.0.1:8003/api',
};

export const productosApi = axios.create({ baseURL: PORTS.productos });
export const carritoApi = axios.create({ baseURL: PORTS.carrito });
export const ordenesApi = axios.create({ baseURL: PORTS.ordenes });