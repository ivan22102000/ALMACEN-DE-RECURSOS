import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductoSchema, insertPromocionSchema, insertPedidoSchema, insertCarritoSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import QRCode from "qrcode";

const JWT_SECRET = process.env.JWT_SECRET || "kivo-super-secret-key";

// Middleware de autenticación para admin
const authenticateAdmin = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUserById(decoded.userId);
    
    if (!user || !user.es_administrador) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Inicializar usuario admin por defecto
  try {
    const adminExists = await storage.getUserByEmail("admin@kivo.com");
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("password", 10);
      await storage.createUser({
        email: "admin@kivo.com",
        password: hashedPassword,
        nombre: "Administrador",
        es_administrador: true,
      });
    }
  } catch (error) {
    console.error("Error inicializando admin:", error);
  }

  // ===================
  // RUTAS DE AUTENTICACIÓN
  // ===================
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          nombre: user.nombre, 
          es_administrador: user.es_administrador 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // ===================
  // RUTAS DE PRODUCTOS
  // ===================
  
  app.get("/api/productos", async (req, res) => {
    try {
      const { busqueda, categoria, ordenar } = req.query;
      const productos = await storage.getProductos({ 
        busqueda: busqueda as string, 
        categoria: categoria as string, 
        ordenar: ordenar as string 
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo productos" });
    }
  });

  app.get("/api/productos/ofertas", async (req, res) => {
    try {
      const productos = await storage.getProductosEnOferta();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo productos en oferta" });
    }
  });

  app.get("/api/productos/admin", authenticateAdmin, async (req, res) => {
    try {
      const productos = await storage.getProductosAdmin();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo productos" });
    }
  });

  app.post("/api/productos", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertProductoSchema.parse(req.body);
      const producto = await storage.createProducto(validatedData);
      res.status(201).json(producto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error creando producto" });
    }
  });

  app.patch("/api/productos/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductoSchema.partial().parse(req.body);
      const producto = await storage.updateProducto(id, validatedData);
      res.json(producto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error actualizando producto" });
    }
  });

  app.delete("/api/productos/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProducto(id);
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando producto" });
    }
  });

  // ===================
  // RUTAS DE CATEGORÍAS
  // ===================
  
  app.get("/api/categorias", async (req, res) => {
    try {
      const categorias = await storage.getCategorias();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo categorías" });
    }
  });

  // ===================
  // RUTAS DE PROMOCIONES
  // ===================
  
  app.get("/api/promociones/admin", authenticateAdmin, async (req, res) => {
    try {
      const promociones = await storage.getPromocionesAdmin();
      res.json(promociones);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo promociones" });
    }
  });

  app.post("/api/promociones", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertPromocionSchema.parse(req.body);
      const promocion = await storage.createPromocion(validatedData);
      res.status(201).json(promocion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error creando promoción" });
    }
  });

  app.patch("/api/promociones/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPromocionSchema.partial().parse(req.body);
      const promocion = await storage.updatePromocion(id, validatedData);
      res.json(promocion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error actualizando promoción" });
    }
  });

  app.delete("/api/promociones/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePromocion(id);
      res.json({ message: "Promoción eliminada" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando promoción" });
    }
  });

  // ===================
  // RUTAS DE CARRITO
  // ===================
  
  app.get("/api/carrito/:sesionId", async (req, res) => {
    try {
      const { sesionId } = req.params;
      const items = await storage.getCarritoItems(sesionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo carrito" });
    }
  });

  app.post("/api/carrito", async (req, res) => {
    try {
      const validatedData = insertCarritoSchema.parse(req.body);
      const item = await storage.addToCarrito(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error agregando al carrito" });
    }
  });

  app.patch("/api/carrito/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      const item = await storage.updateCarritoItem(id, cantidad);
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error actualizando carrito" });
    }
  });

  app.delete("/api/carrito/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.removeFromCarrito(id);
      res.json({ message: "Item eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando del carrito" });
    }
  });

  app.delete("/api/carrito/sesion/:sesionId", async (req, res) => {
    try {
      const { sesionId } = req.params;
      await storage.clearCarrito(sesionId);
      res.json({ message: "Carrito vaciado" });
    } catch (error) {
      res.status(500).json({ message: "Error vaciando carrito" });
    }
  });

  // ===================
  // RUTAS DE PEDIDOS
  // ===================
  
  app.post("/api/pedidos", async (req, res) => {
    try {
      const validatedData = insertPedidoSchema.parse(req.body);
      const { sesion_id, ...pedidoData } = req.body;
      
      // Obtener items del carrito
      const carritoItems = await storage.getCarritoItems(sesion_id);
      if (carritoItems.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
      }

      // Crear pedido
      const pedido = await storage.createPedido({
        ...pedidoData,
        total: carritoItems.reduce((sum, item) => sum + (parseFloat(item.producto.precio) * item.cantidad), 0).toString()
      });

      // Crear detalles del pedido
      for (const item of carritoItems) {
        await storage.createDetallePedido({
          pedido_id: pedido.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio,
          descuento_aplicado: "0"
        });
      }

      // Limpiar carrito
      await storage.clearCarrito(sesion_id);

      res.status(201).json(pedido);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error creando pedido" });
    }
  });

  // ===================
  // RUTAS DE FICHAS
  // ===================
  
  app.get("/api/admin/fichas", authenticateAdmin, async (req, res) => {
    try {
      const { estado, fecha, busqueda } = req.query;
      const fichas = await storage.getHistorialFichas({ 
        estado: estado as string, 
        fecha: fecha as string, 
        busqueda: busqueda as string 
      });
      res.json(fichas);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo historial de fichas" });
    }
  });

  app.post("/api/admin/fichas/generar", authenticateAdmin, async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      
      // Verificar que el pedido existe
      const pedido = await storage.getPedidoByCodigo(codigo_compra);
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }

      // Verificar que no existe ya una ficha
      const fichaExistente = await storage.getFichaByCodigo(codigo_compra);
      if (fichaExistente) {
        return res.status(400).json({ message: "Ya existe una ficha para este pedido" });
      }

      // Generar token único
      const token = crypto.randomBytes(16).toString('hex');
      const tokenEncriptado = crypto.createHash('sha256').update(token).digest('hex');

      // Crear ficha
      const ficha = await storage.createFicha({
        codigo_compra,
        token,
        token_encriptado: tokenEncriptado,
        estado: "activo",
        fecha_expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      });

      // Generar QR
      const qrData = JSON.stringify({ cod_ficha: token, cod_compra: codigo_compra });
      const qrImage = await QRCode.toDataURL(qrData, { 
        width: 150, 
        margin: 1, 
        color: { dark: '#000000', light: '#FFFFFF' } 
      });

      res.json({ ficha, qrImage });
    } catch (error) {
      res.status(500).json({ message: "Error generando ficha" });
    }
  });

  app.post("/api/fichas/validar", async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      
      const ficha = await storage.getFichaByCodigo(codigo_compra);
      if (!ficha) {
        return res.status(404).json({ message: "Ficha no encontrada" });
      }

      if (ficha.estado !== 'activo') {
        return res.status(400).json({ message: "La ficha ya fue canjeada o está expirada" });
      }

      if (new Date(ficha.fecha_expiracion) < new Date()) {
        await storage.updateFicha(ficha.id, { estado: 'expirado' });
        return res.status(400).json({ message: "La ficha ha expirado" });
      }

      res.json(ficha);
    } catch (error) {
      res.status(500).json({ message: "Error validando ficha" });
    }
  });

  app.post("/api/fichas/canjear", async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      
      const ficha = await storage.getFichaByCodigo(codigo_compra);
      if (!ficha || ficha.estado !== 'activo') {
        return res.status(404).json({ message: "Ficha no válida" });
      }

      // Actualizar estado de la ficha
      await storage.updateFicha(ficha.id, { 
        estado: 'canjeado',
        canjeado_en: new Date()
      });

      res.json({ 
        message: "Ficha canjeada exitosamente",
        descuento_aplicado: 10 // 10% de descuento por defecto
      });
    } catch (error) {
      res.status(500).json({ message: "Error canjeando ficha" });
    }
  });

  app.post("/api/admin/fichas/canjear-manual", authenticateAdmin, async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      
      const ficha = await storage.getFichaByCodigo(codigo_compra);
      if (!ficha || ficha.estado !== 'activo') {
        return res.status(404).json({ message: "Ficha no válida" });
      }

      await storage.updateFicha(ficha.id, { 
        estado: 'canjeado',
        canjeado_en: new Date()
      });

      res.json({ message: "Ficha canjeada manualmente" });
    } catch (error) {
      res.status(500).json({ message: "Error canjeando ficha manualmente" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
