# Instrucciones de Uso - Kivo Flutter App

## 🚀 Cómo ejecutar la aplicación

### Paso 1: Configurar el Backend
Antes de usar la aplicación Flutter, asegúrate de que el backend esté funcionando:

```bash
cd HolaChat
npm install
npm run dev
```

El servidor debería estar ejecutándose en `http://localhost:5000`

### Paso 2: Configurar la aplicación Flutter

1. **Navegar al directorio de Flutter:**
   ```bash
   cd kivo_flutter_app
   ```

2. **Instalar dependencias:**
   ```bash
   flutter pub get
   ```

3. **Configurar la URL del backend:**
   - Abrir `lib/services/api_service.dart`
   - Cambiar la línea 9 de:
     ```dart
     static const String baseUrl = 'http://localhost:5000/api';
     ```
   - A la URL donde esté ejecutándose tu backend (ej: `http://192.168.1.100:5000/api`)

4. **Ejecutar la aplicación:**
   ```bash
   flutter run
   ```

## 📱 Funcionalidades disponibles

### Para Usuarios:
- ✅ **Navegación de productos** - Explora el catálogo completo
- ✅ **Búsqueda y filtros** - Encuentra productos específicos
- ✅ **Carrito de compras** - Agrega, modifica y elimina productos
- ✅ **Detalles de producto** - Vista completa con imágenes y descripciones
- ✅ **Canje de vouchers** - Valida y canjea códigos de descuento
- ✅ **Autenticación** - Inicia sesión para funciones avanzadas

### Para Administradores:
- ✅ **Panel de login** - Acceso con credenciales de administrador
- ⏳ **Gestión de productos** - (Próximamente en el panel admin)

## 🔑 Credenciales de prueba

### Usuario Administrador:
- **Email:** `admin@kivo.com`
- **Contraseña:** `password`

### Códigos de voucher de prueba:
Para probar el sistema de vouchers, primero necesitas:
1. Crear un pedido a través del backend web
2. Generar una ficha usando el panel de administración web
3. Usar el código generado en la app móvil

## 🛠️ Solución de problemas comunes

### Error de conexión a la API:
1. Verificar que el backend esté ejecutándose
2. Comprobar la URL en `api_service.dart`
3. Asegurarse de que el dispositivo/emulador pueda acceder al servidor

### Problemas con imágenes:
Las imágenes de productos deben estar disponibles públicamente. Si estás usando localhost, las imágenes podrían no cargar en dispositivos físicos.

### Error de compilación:
```bash
flutter clean
flutter pub get
flutter run
```

## 📊 Estructura de datos

La aplicación consume los mismos endpoints que la versión web:

- `GET /api/productos` - Lista de productos
- `GET /api/productos/ofertas` - Productos en oferta
- `POST /api/auth/login` - Autenticación
- `GET /api/carrito/:sessionId` - Items del carrito
- `POST /api/carrito` - Agregar al carrito
- `POST /api/fichas/validar` - Validar voucher
- `POST /api/fichas/canjear` - Canjear voucher

## 🔄 Flujo de uso típico

1. **Inicio:** Usuario abre la app y ve productos destacados
2. **Exploración:** Navega al catálogo completo con búsqueda/filtros
3. **Selección:** Toca un producto para ver detalles completos
4. **Carrito:** Agrega productos al carrito con cantidades
5. **Revisión:** Ve el carrito con totales y opciones de edición
6. **Voucher:** Opcionalmente canjea códigos de descuento
7. **Checkout:** Procede al proceso de pago (preparado para implementar)

## ✨ Características destacadas

- **Interfaz nativa** con Material Design 3
- **Navegación fluida** entre pantallas
- **Estado persistente** del carrito y autenticación
- **Imágenes optimizadas** con caché
- **Validación en tiempo real** de formularios
- **Manejo de errores** con mensajes informativos
- **Responsive design** para diferentes tamaños de pantalla

## 🔮 Próximas funcionalidades

- Panel de administración completo
- Escáner QR para vouchers
- Notificaciones push
- Modo offline básico
- Integración con pasarelas de pago
- Historial de pedidos
- Sistema de favoritos

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, puedes:
1. Revisar los logs de la consola
2. Verificar la conexión de red
3. Consultar la documentación del backend en `HolaChat/README.md`