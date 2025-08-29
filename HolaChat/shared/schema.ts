import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Usuarios del sistema
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  nombre: text("nombre").notNull(),
  es_administrador: boolean("es_administrador").default(false),
  creado_en: timestamp("creado_en").defaultNow(),
});

// Categorías de productos
export const categorias = pgTable("categorias", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  activa: boolean("activa").default(true),
});

// Productos
export const productos = pgTable("productos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  categoria_id: uuid("categoria_id").references(() => categorias.id),
  activo: boolean("activo").default(true),
  creado_en: timestamp("creado_en").defaultNow(),
});

// Imágenes de productos
export const imagenes_productos = pgTable("imagenes_productos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  producto_id: uuid("producto_id").references(() => productos.id),
  url_imagen: text("url_imagen").notNull(),
  es_principal: boolean("es_principal").default(false),
  creado_en: timestamp("creado_en").defaultNow(),
});

// Promociones
export const promociones = pgTable("promociones", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  producto_id: uuid("producto_id").references(() => productos.id),
  nombre: text("nombre").notNull(),
  porcentaje_descuento: decimal("porcentaje_descuento", { precision: 5, scale: 2 }).notNull(),
  fecha_inicio: timestamp("fecha_inicio").notNull(),
  fecha_fin: timestamp("fecha_fin").notNull(),
  activa: boolean("activa").default(true),
  creado_en: timestamp("creado_en").defaultNow(),
});

// Pedidos
export const pedidos = pgTable("pedidos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo_compra: text("codigo_compra").notNull().unique(),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  nombre_cliente: text("nombre_cliente").notNull(),
  email_cliente: text("email_cliente"),
  telefono_cliente: text("telefono_cliente"),
  direccion_cliente: text("direccion_cliente"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  estado: text("estado").default("pendiente"), // pendiente, procesando, enviado, entregado, cancelado
  creado_en: timestamp("creado_en").defaultNow(),
});

// Detalles de pedidos
export const detalles_pedidos = pgTable("detalles_pedidos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pedido_id: uuid("pedido_id").references(() => pedidos.id),
  producto_id: uuid("producto_id").references(() => productos.id),
  cantidad: integer("cantidad").notNull(),
  precio_unitario: decimal("precio_unitario", { precision: 10, scale: 2 }).notNull(),
  descuento_aplicado: decimal("descuento_aplicado", { precision: 5, scale: 2 }).default("0"),
});

// Fichas de fidelidad
export const fichas = pgTable("fichas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo_compra: text("codigo_compra").notNull(),
  token: text("token").notNull().unique(),
  token_encriptado: text("token_encriptado").notNull(),
  estado: text("estado").default("activo"), // activo, canjeado, expirado
  fecha_expiracion: timestamp("fecha_expiracion").notNull(),
  creado_en: timestamp("creado_en").defaultNow(),
  canjeado_en: timestamp("canjeado_en"),
});

// Configuración del sistema
export const configuracion = pgTable("configuracion", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clave: text("clave").notNull().unique(),
  valor: text("valor").notNull(),
  descripcion: text("descripcion"),
  actualizado_en: timestamp("actualizado_en").defaultNow(),
});

// Carrito de compras (temporal)
export const carrito = pgTable("carrito", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sesion_id: text("sesion_id").notNull(),
  producto_id: uuid("producto_id").references(() => productos.id),
  cantidad: integer("cantidad").notNull(),
  creado_en: timestamp("creado_en").defaultNow(),
});

// Auditoría
export const auditoria = pgTable("auditoria", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  accion: text("accion").notNull(),
  tabla_afectada: text("tabla_afectada"),
  registro_id: text("registro_id"),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  detalles: text("detalles"),
  creado_en: timestamp("creado_en").defaultNow(),
});

// Schemas para validación
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  creado_en: true,
});

export const insertProductoSchema = createInsertSchema(productos).omit({
  id: true,
  creado_en: true,
});

export const insertPromocionSchema = createInsertSchema(promociones).omit({
  id: true,
  creado_en: true,
});

export const insertPedidoSchema = createInsertSchema(pedidos).omit({
  id: true,
  codigo_compra: true,
  creado_en: true,
});

export const insertFichaSchema = createInsertSchema(fichas).omit({
  id: true,
  creado_en: true,
  canjeado_en: true,
});

export const insertCarritoSchema = createInsertSchema(carrito).omit({
  id: true,
  creado_en: true,
});

// Tipos
export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;

export type Producto = typeof productos.$inferSelect;
export type InsertProducto = z.infer<typeof insertProductoSchema>;

export type Promocion = typeof promociones.$inferSelect;
export type InsertPromocion = z.infer<typeof insertPromocionSchema>;

export type Pedido = typeof pedidos.$inferSelect;
export type InsertPedido = z.infer<typeof insertPedidoSchema>;

export type Ficha = typeof fichas.$inferSelect;
export type InsertFicha = z.infer<typeof insertFichaSchema>;

export type CarritoItem = typeof carrito.$inferSelect;
export type InsertCarritoItem = z.infer<typeof insertCarritoSchema>;

export type ImagenProducto = typeof imagenes_productos.$inferSelect;
export type DetallesPedido = typeof detalles_pedidos.$inferSelect;
export type Configuracion = typeof configuracion.$inferSelect;
export type Auditoria = typeof auditoria.$inferSelect;
