var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, asc, like, and, or, gte } from "drizzle-orm";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditoria: () => auditoria,
  carrito: () => carrito,
  categorias: () => categorias,
  configuracion: () => configuracion,
  detalles_pedidos: () => detalles_pedidos,
  fichas: () => fichas,
  imagenes_productos: () => imagenes_productos,
  insertCarritoSchema: () => insertCarritoSchema,
  insertFichaSchema: () => insertFichaSchema,
  insertPedidoSchema: () => insertPedidoSchema,
  insertProductoSchema: () => insertProductoSchema,
  insertPromocionSchema: () => insertPromocionSchema,
  insertUsuarioSchema: () => insertUsuarioSchema,
  pedidos: () => pedidos,
  productos: () => productos,
  promociones: () => promociones,
  usuarios: () => usuarios
});
import { sql } from "drizzle-orm";
import { pgTable, text, integer, decimal, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  nombre: text("nombre").notNull(),
  es_administrador: boolean("es_administrador").default(false),
  creado_en: timestamp("creado_en").defaultNow()
});
var categorias = pgTable("categorias", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  activa: boolean("activa").default(true)
});
var productos = pgTable("productos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  categoria_id: uuid("categoria_id").references(() => categorias.id),
  activo: boolean("activo").default(true),
  creado_en: timestamp("creado_en").defaultNow()
});
var imagenes_productos = pgTable("imagenes_productos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  producto_id: uuid("producto_id").references(() => productos.id),
  url_imagen: text("url_imagen").notNull(),
  es_principal: boolean("es_principal").default(false),
  creado_en: timestamp("creado_en").defaultNow()
});
var promociones = pgTable("promociones", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  producto_id: uuid("producto_id").references(() => productos.id),
  nombre: text("nombre").notNull(),
  porcentaje_descuento: decimal("porcentaje_descuento", { precision: 5, scale: 2 }).notNull(),
  fecha_inicio: timestamp("fecha_inicio").notNull(),
  fecha_fin: timestamp("fecha_fin").notNull(),
  activa: boolean("activa").default(true),
  creado_en: timestamp("creado_en").defaultNow()
});
var pedidos = pgTable("pedidos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo_compra: text("codigo_compra").notNull().unique(),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  nombre_cliente: text("nombre_cliente").notNull(),
  email_cliente: text("email_cliente"),
  telefono_cliente: text("telefono_cliente"),
  direccion_cliente: text("direccion_cliente"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  estado: text("estado").default("pendiente"),
  // pendiente, procesando, enviado, entregado, cancelado
  creado_en: timestamp("creado_en").defaultNow()
});
var detalles_pedidos = pgTable("detalles_pedidos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pedido_id: uuid("pedido_id").references(() => pedidos.id),
  producto_id: uuid("producto_id").references(() => productos.id),
  cantidad: integer("cantidad").notNull(),
  precio_unitario: decimal("precio_unitario", { precision: 10, scale: 2 }).notNull(),
  descuento_aplicado: decimal("descuento_aplicado", { precision: 5, scale: 2 }).default("0")
});
var fichas = pgTable("fichas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo_compra: text("codigo_compra").notNull(),
  token: text("token").notNull().unique(),
  token_encriptado: text("token_encriptado").notNull(),
  estado: text("estado").default("activo"),
  // activo, canjeado, expirado
  fecha_expiracion: timestamp("fecha_expiracion").notNull(),
  creado_en: timestamp("creado_en").defaultNow(),
  canjeado_en: timestamp("canjeado_en")
});
var configuracion = pgTable("configuracion", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clave: text("clave").notNull().unique(),
  valor: text("valor").notNull(),
  descripcion: text("descripcion"),
  actualizado_en: timestamp("actualizado_en").defaultNow()
});
var carrito = pgTable("carrito", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sesion_id: text("sesion_id").notNull(),
  producto_id: uuid("producto_id").references(() => productos.id),
  cantidad: integer("cantidad").notNull(),
  creado_en: timestamp("creado_en").defaultNow()
});
var auditoria = pgTable("auditoria", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  accion: text("accion").notNull(),
  tabla_afectada: text("tabla_afectada"),
  registro_id: text("registro_id"),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  detalles: text("detalles"),
  creado_en: timestamp("creado_en").defaultNow()
});
var insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  creado_en: true
});
var insertProductoSchema = createInsertSchema(productos).omit({
  id: true,
  creado_en: true
});
var insertPromocionSchema = createInsertSchema(promociones).omit({
  id: true,
  creado_en: true
});
var insertPedidoSchema = createInsertSchema(pedidos).omit({
  id: true,
  codigo_compra: true,
  creado_en: true
});
var insertFichaSchema = createInsertSchema(fichas).omit({
  id: true,
  creado_en: true,
  canjeado_en: true
});
var insertCarritoSchema = createInsertSchema(carrito).omit({
  id: true,
  creado_en: true
});

// server/storage.ts
import crypto from "crypto";
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no est\xE1 configurada");
}
var client = postgres(connectionString);
var db = drizzle(client, { schema: schema_exports });
var PostgresStorage = class {
  // ===================
  // MÉTODOS DE USUARIOS
  // ===================
  async getUserById(id) {
    const result = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
    return result[0];
  }
  async createUser(user) {
    const result = await db.insert(usuarios).values(user).returning();
    return result[0];
  }
  // ===================
  // MÉTODOS DE PRODUCTOS
  // ===================
  async getProductos(filtros) {
    const condiciones = [eq(productos.activo, true)];
    if (filtros?.busqueda) {
      condiciones.push(like(productos.nombre, `%${filtros.busqueda}%`));
    }
    if (filtros?.categoria) {
      condiciones.push(eq(productos.categoria_id, filtros.categoria));
    }
    let query = db.select({
      id: productos.id,
      nombre: productos.nombre,
      descripcion: productos.descripcion,
      precio: productos.precio,
      stock: productos.stock,
      activo: productos.activo,
      creado_en: productos.creado_en
    }).from(productos).where(and(...condiciones));
    switch (filtros?.ordenar) {
      case "precio_asc":
        query = query.orderBy(asc(productos.precio));
        break;
      case "precio_desc":
        query = query.orderBy(desc(productos.precio));
        break;
      case "nombre_asc":
        query = query.orderBy(asc(productos.nombre));
        break;
      case "nombre_desc":
        query = query.orderBy(desc(productos.nombre));
        break;
      default:
        query = query.orderBy(desc(productos.creado_en));
    }
    const productos2 = await query;
    const productosConDetalles = await Promise.all(
      productos2.map(async (producto) => {
        const imagenes = await db.select().from(imagenes_productos).where(eq(imagenes_productos.producto_id, producto.id));
        const promociones2 = await db.select().from(promociones).where(
          and(
            eq(promociones.producto_id, producto.id),
            eq(promociones.activa, true),
            gte(promociones.fecha_fin, /* @__PURE__ */ new Date())
          )
        );
        return {
          ...producto,
          imagenes_productos: imagenes,
          promociones: promociones2
        };
      })
    );
    return productosConDetalles;
  }
  async getProductosEnOferta() {
    const promocionesActivas = await db.select({
      producto_id: promociones.producto_id,
      porcentaje_descuento: promociones.porcentaje_descuento,
      fecha_fin: promociones.fecha_fin
    }).from(promociones).where(
      and(
        eq(promociones.activa, true),
        gte(promociones.fecha_fin, /* @__PURE__ */ new Date())
      )
    );
    if (promocionesActivas.length === 0) {
      return [];
    }
    const productosIds = promocionesActivas.map((p) => p.producto_id).filter(Boolean);
    const productos2 = await db.select().from(productos).where(
      and(
        eq(productos.activo, true),
        or(...productosIds.map((id) => eq(productos.id, id)))
      )
    );
    const productosConDetalles = await Promise.all(
      productos2.map(async (producto) => {
        const imagenes = await db.select().from(imagenes_productos).where(eq(imagenes_productos.producto_id, producto.id));
        const promociones2 = await db.select().from(promociones).where(
          and(
            eq(promociones.producto_id, producto.id),
            eq(promociones.activa, true),
            gte(promociones.fecha_fin, /* @__PURE__ */ new Date())
          )
        );
        return {
          ...producto,
          imagenes_productos: imagenes,
          promociones: promociones2
        };
      })
    );
    return productosConDetalles;
  }
  async getProductosAdmin() {
    const productos2 = await db.select().from(productos).orderBy(desc(productos.creado_en));
    const productosConDetalles = await Promise.all(
      productos2.map(async (producto) => {
        const imagenes = await db.select().from(imagenes_productos).where(eq(imagenes_productos.producto_id, producto.id));
        const categoria = producto.categoria_id ? await db.select().from(categorias).where(eq(categorias.id, producto.categoria_id)).limit(1) : [];
        return {
          ...producto,
          imagenes_productos: imagenes,
          categoria: categoria[0] || null
        };
      })
    );
    return productosConDetalles;
  }
  async createProducto(producto) {
    const result = await db.insert(productos).values(producto).returning();
    return result[0];
  }
  async updateProducto(id, datos) {
    const result = await db.update(productos).set(datos).where(eq(productos.id, id)).returning();
    return result[0];
  }
  async deleteProducto(id) {
    await db.delete(productos).where(eq(productos.id, id));
  }
  // ===================
  // MÉTODOS DE CATEGORÍAS
  // ===================
  async getCategorias() {
    return await db.select().from(categorias).where(eq(categorias.activa, true)).orderBy(asc(categorias.nombre));
  }
  // ===================
  // MÉTODOS DE PROMOCIONES
  // ===================
  async getPromocionesAdmin() {
    const promociones2 = await db.select().from(promociones).orderBy(desc(promociones.creado_en));
    const promocionesConProducto = await Promise.all(
      promociones2.map(async (promocion) => {
        const producto = promocion.producto_id ? await db.select().from(productos).where(eq(productos.id, promocion.producto_id)).limit(1) : [];
        return {
          ...promocion,
          producto: producto[0] || null
        };
      })
    );
    return promocionesConProducto;
  }
  async createPromocion(promocion) {
    const result = await db.insert(promociones).values(promocion).returning();
    return result[0];
  }
  async updatePromocion(id, datos) {
    const result = await db.update(promociones).set(datos).where(eq(promociones.id, id)).returning();
    return result[0];
  }
  async deletePromocion(id) {
    await db.delete(promociones).where(eq(promociones.id, id));
  }
  // ===================
  // MÉTODOS DE CARRITO
  // ===================
  async getCarritoItems(sesionId) {
    const items = await db.select().from(carrito).where(eq(carrito.sesion_id, sesionId)).orderBy(desc(carrito.creado_en));
    const itemsConProducto = await Promise.all(
      items.map(async (item) => {
        const producto = await db.select().from(productos).where(eq(productos.id, item.producto_id)).limit(1);
        const imagenes = await db.select().from(imagenes_productos).where(eq(imagenes_productos.producto_id, item.producto_id));
        return {
          ...item,
          producto: {
            ...producto[0],
            imagenes_productos: imagenes
          }
        };
      })
    );
    return itemsConProducto;
  }
  async addToCarrito(item) {
    const existing = await db.select().from(carrito).where(
      and(
        eq(carrito.sesion_id, item.sesion_id),
        eq(carrito.producto_id, item.producto_id)
      )
    ).limit(1);
    if (existing.length > 0) {
      const result = await db.update(carrito).set({ cantidad: existing[0].cantidad + item.cantidad }).where(eq(carrito.id, existing[0].id)).returning();
      return result[0];
    } else {
      const result = await db.insert(carrito).values(item).returning();
      return result[0];
    }
  }
  async updateCarritoItem(id, cantidad) {
    const result = await db.update(carrito).set({ cantidad }).where(eq(carrito.id, id)).returning();
    return result[0];
  }
  async removeFromCarrito(id) {
    await db.delete(carrito).where(eq(carrito.id, id));
  }
  async clearCarrito(sesionId) {
    await db.delete(carrito).where(eq(carrito.sesion_id, sesionId));
  }
  // ===================
  // MÉTODOS DE PEDIDOS
  // ===================
  async createPedido(pedido) {
    const codigoCompra = `KIVO-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const result = await db.insert(pedidos).values({
      ...pedido,
      codigo_compra: codigoCompra
    }).returning();
    return result[0];
  }
  async createDetallePedido(detalle) {
    const result = await db.insert(detalles_pedidos).values(detalle).returning();
    return result[0];
  }
  async getPedidoByCodigo(codigo) {
    const result = await db.select().from(pedidos).where(eq(pedidos.codigo_compra, codigo)).limit(1);
    return result[0];
  }
  // ===================
  // MÉTODOS DE FICHAS
  // ===================
  async getHistorialFichas(filtros) {
    const pedidos2 = await db.select().from(pedidos).orderBy(desc(pedidos.creado_en));
    const pedidosConFichas = await Promise.all(
      pedidos2.map(async (pedido) => {
        const ficha = await db.select().from(fichas).where(eq(fichas.codigo_compra, pedido.codigo_compra)).limit(1);
        return {
          ...pedido,
          ficha: ficha[0] || null
        };
      })
    );
    let resultado = pedidosConFichas;
    if (filtros?.estado) {
      resultado = resultado.filter(
        (item) => item.ficha?.estado === filtros.estado
      );
    }
    if (filtros?.busqueda) {
      resultado = resultado.filter(
        (item) => item.codigo_compra.toLowerCase().includes(filtros.busqueda.toLowerCase()) || item.nombre_cliente.toLowerCase().includes(filtros.busqueda.toLowerCase())
      );
    }
    if (filtros?.fecha) {
      const fechaFiltro = new Date(filtros.fecha);
      resultado = resultado.filter((item) => {
        const fechaItem = new Date(item.creado_en);
        return fechaItem.toDateString() === fechaFiltro.toDateString();
      });
    }
    return resultado;
  }
  async getFichaByCodigo(codigo) {
    const result = await db.select().from(fichas).where(eq(fichas.codigo_compra, codigo)).limit(1);
    return result[0];
  }
  async createFicha(ficha) {
    const result = await db.insert(fichas).values(ficha).returning();
    return result[0];
  }
  async updateFicha(id, datos) {
    const result = await db.update(fichas).set(datos).where(eq(fichas.id, id)).returning();
    return result[0];
  }
};
var storage = new PostgresStorage();

// server/routes.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto2 from "crypto";
import QRCode from "qrcode";
var JWT_SECRET = process.env.JWT_SECRET || "kivo-super-secret-key";
var authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUserById(decoded.userId);
    if (!user || !user.es_administrador) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inv\xE1lido" });
  }
};
async function registerRoutes(app2) {
  try {
    const adminExists = await storage.getUserByEmail("admin@kivo.com");
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("password", 10);
      await storage.createUser({
        email: "admin@kivo.com",
        password: hashedPassword,
        nombre: "Administrador",
        es_administrador: true
      });
    }
  } catch (error) {
    console.error("Error inicializando admin:", error);
  }
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inv\xE1lidas" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales inv\xE1lidas" });
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
  app2.get("/api/productos", async (req, res) => {
    try {
      const { busqueda, categoria, ordenar } = req.query;
      const productos2 = await storage.getProductos({
        busqueda,
        categoria,
        ordenar
      });
      res.json(productos2);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo productos" });
    }
  });
  app2.get("/api/productos/ofertas", async (req, res) => {
    try {
      const productos2 = await storage.getProductosEnOferta();
      res.json(productos2);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo productos en oferta" });
    }
  });
  app2.get("/api/productos/admin", authenticateAdmin, async (req, res) => {
    try {
      const productos2 = await storage.getProductosAdmin();
      res.json(productos2);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo productos" });
    }
  });
  app2.post("/api/productos", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertProductoSchema.parse(req.body);
      const producto = await storage.createProducto(validatedData);
      res.status(201).json(producto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error creando producto" });
    }
  });
  app2.patch("/api/productos/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductoSchema.partial().parse(req.body);
      const producto = await storage.updateProducto(id, validatedData);
      res.json(producto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error actualizando producto" });
    }
  });
  app2.delete("/api/productos/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProducto(id);
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando producto" });
    }
  });
  app2.get("/api/categorias", async (req, res) => {
    try {
      const categorias2 = await storage.getCategorias();
      res.json(categorias2);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo categor\xEDas" });
    }
  });
  app2.get("/api/promociones/admin", authenticateAdmin, async (req, res) => {
    try {
      const promociones2 = await storage.getPromocionesAdmin();
      res.json(promociones2);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo promociones" });
    }
  });
  app2.post("/api/promociones", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertPromocionSchema.parse(req.body);
      const promocion = await storage.createPromocion(validatedData);
      res.status(201).json(promocion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error creando promoci\xF3n" });
    }
  });
  app2.patch("/api/promociones/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPromocionSchema.partial().parse(req.body);
      const promocion = await storage.updatePromocion(id, validatedData);
      res.json(promocion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error actualizando promoci\xF3n" });
    }
  });
  app2.delete("/api/promociones/:id", authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePromocion(id);
      res.json({ message: "Promoci\xF3n eliminada" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando promoci\xF3n" });
    }
  });
  app2.get("/api/carrito/:sesionId", async (req, res) => {
    try {
      const { sesionId } = req.params;
      const items = await storage.getCarritoItems(sesionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo carrito" });
    }
  });
  app2.post("/api/carrito", async (req, res) => {
    try {
      const validatedData = insertCarritoSchema.parse(req.body);
      const item = await storage.addToCarrito(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error agregando al carrito" });
    }
  });
  app2.patch("/api/carrito/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      const item = await storage.updateCarritoItem(id, cantidad);
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error actualizando carrito" });
    }
  });
  app2.delete("/api/carrito/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.removeFromCarrito(id);
      res.json({ message: "Item eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando del carrito" });
    }
  });
  app2.delete("/api/carrito/sesion/:sesionId", async (req, res) => {
    try {
      const { sesionId } = req.params;
      await storage.clearCarrito(sesionId);
      res.json({ message: "Carrito vaciado" });
    } catch (error) {
      res.status(500).json({ message: "Error vaciando carrito" });
    }
  });
  app2.post("/api/pedidos", async (req, res) => {
    try {
      const validatedData = insertPedidoSchema.parse(req.body);
      const { sesion_id, ...pedidoData } = req.body;
      const carritoItems = await storage.getCarritoItems(sesion_id);
      if (carritoItems.length === 0) {
        return res.status(400).json({ message: "El carrito est\xE1 vac\xEDo" });
      }
      const pedido = await storage.createPedido({
        ...pedidoData,
        total: carritoItems.reduce((sum, item) => sum + parseFloat(item.producto.precio) * item.cantidad, 0).toString()
      });
      for (const item of carritoItems) {
        await storage.createDetallePedido({
          pedido_id: pedido.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio,
          descuento_aplicado: "0"
        });
      }
      await storage.clearCarrito(sesion_id);
      res.status(201).json(pedido);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error creando pedido" });
    }
  });
  app2.get("/api/admin/fichas", authenticateAdmin, async (req, res) => {
    try {
      const { estado, fecha, busqueda } = req.query;
      const fichas2 = await storage.getHistorialFichas({
        estado,
        fecha,
        busqueda
      });
      res.json(fichas2);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo historial de fichas" });
    }
  });
  app2.post("/api/admin/fichas/generar", authenticateAdmin, async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      const pedido = await storage.getPedidoByCodigo(codigo_compra);
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      const fichaExistente = await storage.getFichaByCodigo(codigo_compra);
      if (fichaExistente) {
        return res.status(400).json({ message: "Ya existe una ficha para este pedido" });
      }
      const token = crypto2.randomBytes(16).toString("hex");
      const tokenEncriptado = crypto2.createHash("sha256").update(token).digest("hex");
      const ficha = await storage.createFicha({
        codigo_compra,
        token,
        token_encriptado: tokenEncriptado,
        estado: "activo",
        fecha_expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
        // 30 días
      });
      const qrData = JSON.stringify({ cod_ficha: token, cod_compra: codigo_compra });
      const qrImage = await QRCode.toDataURL(qrData, {
        width: 150,
        margin: 1,
        color: { dark: "#000000", light: "#FFFFFF" }
      });
      res.json({ ficha, qrImage });
    } catch (error) {
      res.status(500).json({ message: "Error generando ficha" });
    }
  });
  app2.post("/api/fichas/validar", async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      const ficha = await storage.getFichaByCodigo(codigo_compra);
      if (!ficha) {
        return res.status(404).json({ message: "Ficha no encontrada" });
      }
      if (ficha.estado !== "activo") {
        return res.status(400).json({ message: "La ficha ya fue canjeada o est\xE1 expirada" });
      }
      if (new Date(ficha.fecha_expiracion) < /* @__PURE__ */ new Date()) {
        await storage.updateFicha(ficha.id, { estado: "expirado" });
        return res.status(400).json({ message: "La ficha ha expirado" });
      }
      res.json(ficha);
    } catch (error) {
      res.status(500).json({ message: "Error validando ficha" });
    }
  });
  app2.post("/api/fichas/canjear", async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      const ficha = await storage.getFichaByCodigo(codigo_compra);
      if (!ficha || ficha.estado !== "activo") {
        return res.status(404).json({ message: "Ficha no v\xE1lida" });
      }
      await storage.updateFicha(ficha.id, {
        estado: "canjeado",
        canjeado_en: /* @__PURE__ */ new Date()
      });
      res.json({
        message: "Ficha canjeada exitosamente",
        descuento_aplicado: 10
        // 10% de descuento por defecto
      });
    } catch (error) {
      res.status(500).json({ message: "Error canjeando ficha" });
    }
  });
  app2.post("/api/admin/fichas/canjear-manual", authenticateAdmin, async (req, res) => {
    try {
      const { codigo_compra } = req.body;
      const ficha = await storage.getFichaByCodigo(codigo_compra);
      if (!ficha || ficha.estado !== "activo") {
        return res.status(404).json({ message: "Ficha no v\xE1lida" });
      }
      await storage.updateFicha(ficha.id, {
        estado: "canjeado",
        canjeado_en: /* @__PURE__ */ new Date()
      });
      res.json({ message: "Ficha canjeada manualmente" });
    } catch (error) {
      res.status(500).json({ message: "Error canjeando ficha manualmente" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
