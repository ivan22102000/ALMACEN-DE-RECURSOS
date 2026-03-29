# Kivo Flutter App

Aplicación móvil Flutter para la plataforma de e-commerce Kivo.

## Características

### 🛍️ Funcionalidades principales
- **Catálogo de productos** con búsqueda y filtros
- **Carrito de compras** con gestión de cantidades
- **Sistema de vouchers/fichas** con códigos QR
- **Panel de administración** para gestión de productos
- **Autenticación** de usuarios y administradores

### 📱 Tecnologías utilizadas
- **Flutter 3.24+** - Framework de desarrollo móvil
- **Provider** - Gestión de estado
- **go_router** - Navegación declarativa
- **HTTP** - Comunicación con API REST
- **SharedPreferences** - Almacenamiento local
- **QR Code Scanner** - Lectura de códigos QR
- **Cached Network Image** - Optimización de imágenes

## 🚀 Instalación y configuración

### Prerrequisitos
- Flutter SDK 3.1.0 o superior
- Dart SDK 3.0.0 o superior
- Android Studio / VS Code
- Dispositivo Android o iOS para pruebas

### Pasos de instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd ALMACEN-DE-RECURSOS/kivo_flutter_app
   ```

2. **Instalar dependencias:**
   ```bash
   flutter pub get
   ```

3. **Generar archivos de serialización:**
   ```bash
   flutter packages pub run build_runner build
   ```

4. **Configurar la URL del backend:**
   Editar `lib/services/api_service.dart` y actualizar la variable `baseUrl` con la URL de tu servidor backend:
   ```dart
   static const String baseUrl = 'https://tu-servidor.com/api';
   ```

5. **Ejecutar la aplicación:**
   ```bash
   flutter run
   ```

## 🏗️ Estructura del proyecto

```
lib/
├── main.dart                 # Punto de entrada de la aplicación
├── models/                   # Modelos de datos
│   ├── product.dart         # Modelo de producto
│   ├── user.dart            # Modelo de usuario
│   ├── cart.dart            # Modelo de carrito
│   ├── order.dart           # Modelo de pedido
│   └── voucher.dart         # Modelo de voucher/ficha
├── services/                # Servicios y lógica de negocio
│   ├── api_service.dart     # Cliente HTTP para API REST
│   ├── auth_service.dart    # Gestión de autenticación
│   └── cart_service.dart    # Gestión del carrito
├── screens/                 # Pantallas de la aplicación
│   ├── home_screen.dart     # Pantalla principal
│   ├── products_screen.dart # Catálogo de productos
│   ├── cart_screen.dart     # Carrito de compras
│   ├── voucher_screen.dart  # Canje de vouchers
│   ├── admin_screen.dart    # Panel de administración
│   └── login_screen.dart    # Inicio de sesión
└── widgets/                 # Componentes reutilizables
    ├── product_card.dart    # Tarjeta de producto
    └── app_drawer.dart      # Menú lateral
```

## 🔗 Integración con Backend

La aplicación Flutter consume la API REST del backend existente (`/HolaChat/server`):

### Endpoints principales:
- `GET /api/productos` - Lista de productos
- `GET /api/productos/ofertas` - Productos en oferta
- `POST /api/auth/login` - Autenticación
- `GET /api/carrito/:sessionId` - Items del carrito
- `POST /api/carrito` - Agregar al carrito
- `POST /api/pedidos` - Crear pedido
- `POST /api/fichas/validar` - Validar voucher
- `POST /api/fichas/canjear` - Canjear voucher

### Configuración del servidor:
Asegúrate de que el servidor backend permita conexiones desde la aplicación móvil:
1. Configurar CORS para permitir orígenes móviles
2. Usar HTTPS en producción
3. Actualizar la URL base en `api_service.dart`

## 📱 Funcionalidades

### Usuario Final:
- ✅ Navegación entre productos y ofertas
- ✅ Búsqueda y filtrado de productos
- ✅ Gestión de carrito de compras
- ✅ Canje de vouchers con código QR
- ✅ Proceso de compra

### Administrador:
- ✅ Autenticación con permisos de admin
- ✅ Gestión de productos y promociones
- ✅ Generación de vouchers
- ✅ Estadísticas y reportes

## 🔧 Desarrollo

### Comandos útiles:

```bash
# Análisis de código
flutter analyze

# Ejecutar tests
flutter test

# Generar build de producción
flutter build apk --release
flutter build appbundle --release  # Para Google Play Store

# Para iOS
flutter build ios --release
```

### Generar modelos JSON:
Después de modificar modelos con `@JsonSerializable()`:
```bash
flutter packages pub run build_runner build --delete-conflicting-outputs
```

## 📦 Build y distribución

### Android:
```bash
# Debug APK
flutter build apk

# Release APK
flutter build apk --release

# App Bundle para Play Store
flutter build appbundle --release
```

### iOS:
```bash
# Para simulador
flutter build ios

# Para dispositivo/App Store
flutter build ios --release
```

## 🐛 Solución de problemas

### Problemas comunes:

1. **Error de conexión a la API:**
   - Verificar que el backend esté ejecutándose
   - Revisar la URL en `api_service.dart`
   - Comprobar permisos de red en AndroidManifest.xml

2. **Errores de compilación:**
   - Ejecutar `flutter clean && flutter pub get`
   - Regenerar archivos JSON: `flutter packages pub run build_runner build`

3. **Problemas con imágenes:**
   - Verificar URLs de imágenes en el backend
   - Comprobar conexión a internet
   - Revisar permisos de internet en la aplicación

## 📄 Licencia

Este proyecto es parte del repositorio ALMACEN-DE-RECURSOS y sigue la misma licencia del proyecto principal.