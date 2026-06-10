# 🛒 MicroShop - E-Commerce Microservices Architecture

Ecosistema distribuido y desacoplado que implementa un flujo transaccional de e-commerce utilizando **Django REST Framework** para el backend, **React con TypeScript y Tailwind CSS v4** para el frontend, y **Docker / Docker Compose** para la orquestación integral de la infraestructura.

---

## 📐 1. Arquitectura del Sistema

El sistema está diseñado bajo el principio de responsabilidad única, dividiendo el dominio del negocio en tres microservicios autónomos que se comunican mediante APIs REST ful, además de una Single Page Application (SPA) reactiva.



* **Servicio de Productos (Puerto `8001`):** Gestiona el catálogo de artículos, descripciones, SKU e inventario físico.
* **Servicio de Carrito (Puerto `8002`):** Administra el estado transitorio de la compra de forma aislada. Implementa hidratación dinámica consultando al catálogo para asegurar la consistencia de precios e imágenes sin duplicar datos persistentes.
* **Servicio de Órdenes (Puerto `8003`):** Orquesta el checkout definitivo. Centraliza la lógica de negocio más crítica: congela el estado, valida stock remanente y descuenta el inventario de forma atómica.

### 🛡️ Decisiones de Diseño 
1.  **Validación de Stock Diferida:** No se bloquea el inventario ni se restringe estrictamente al llenar el carrito para evitar "falsos agotados" generados por carritos abandonados. El control estricto de concurrencia se ejecuta únicamente al crear la orden.
2.  **Prevención de Condiciones de Carrera (Race Conditions):** El servicio de órdenes implementa bloqueos pesimistas a nivel de base de datos mediante `select_for_update()` durante la transacción de descuento de stock, garantizando la integridad transaccional ante compras simultáneas de una misma unidad.
3.  **Sesión de Usuario Simulada:** Para cumplir con el alcance ágil de la prueba sin incorporar módulos complejos de autenticación (OAuth2/JWT), se utiliza un identificador de sesión estático (`usuario_id=1`). El desacoplamiento es total, por lo que integrar un API Gateway o middleware de verificación de tokens requeriría un refactor mínimo.

---

## 🛠️ 2. Stack Tecnológico

* **Backend:** Python 3.11, Django 5.0, Django REST Framework, SQLite (Bases de datos independientes por servicio).
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Axios.
* **Infraestructura:** Docker, Docker Compose (WSL / Linux compatible).

---

## 🚀 3. Instalación y Arranque


1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/eiderochoa/mini_ecomerce.git
   cd mini_ecomerce
   ```
2. **Instalar requerimientos de backend:**
   ```bash
   cd backend
   python -m venv venv
   pip install -r productos_service/requirements.txt
   ```
3. **Instalar requerimientos de frontend:**
   ```bash
   cd frontend
   npm install
   ```
4. **Desplegar los microservicios:**
   ```bash
   cd backend
   python productos_service/manage.py runserver 8001
   python carrito_service/manage.py runserver 8002
   python orden_service/manage.py runserver 8003
   ```
5. **Desplegar el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### NOTA: Las direcciones estan escritas para linux, si usa windows utilice la barra invertida "\" (ej: orden_service\manage.py)