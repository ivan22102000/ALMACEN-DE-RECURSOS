import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, asc, like, and, or, gte, lte } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  Usuario, InsertUsuario, 
  Producto, InsertProducto,
  Promocion, InsertPromocion,
  Pedido, InsertPedido,
  Ficha, InsertFicha,
  CarritoItem, InsertCarritoItem
} from "@shared/schema";
import crypto from "crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

export interface IStorage {
  // Usuarios
  getUserById(id: string): Promise<Usuario | undefined>;
  getUserByEmail(email: string): Promise<Usuario | undefined>;
  createUser(user: InsertUsuario): Promise<Usuario>;

  // Productos
  getProductos(filtros?: { busqueda?: string; categoria?: string; ordenar?: string }): Promise<any[]>;
  getProductosEnOferta(): Promise<any[]>;
  getProductosAdmin(): Promise<any[]>;
  createProducto(producto: InsertProducto): Promise<Producto>;
  updateProducto(id: string, datos: Partial<InsertProducto>): Promise<Producto>;
  deleteProducto(id: string): Promise<void>;

  // Categorías
  getCategorias(): Promise<any[]>;

  // Promociones
  getPromocionesAdmin(): Promise<any[]>;
  createPromocion(promocion: InsertPromocion): Promise<Promocion>;
  updatePromocion(id: string, datos: Partial<InsertPromocion>): Promise<Promocion>;
  deletePromocion(id: string): Promise<void>;

  // Carrito
  getCarritoItems(sesionId: string): Promise<any[]>;
  addToCarrito(item: InsertCarritoItem): Promise<CarritoItem>;
  updateCarritoItem(id: string, cantidad: number): Promise<CarritoItem>;
  removeFromCarrito(id: string): Promise<void>;
  clearCarrito(sesionId: string): Promise<void>;

  // Pedidos
  createPedido(pedido: InsertPedido): Promise<Pedido>;
  createDetallePedido(detalle: any): Promise<any>;
  getPedidoByCodigo(codigo: string): Promise<Pedido | undefined>;

  // Fichas
  getHistorialFichas(filtros?: { estado?: string; fecha?: string; busqueda?: string }): Promise<any[]>;
  getFichaByCodigo(codigo: string): Promise<Ficha | undefined>;
  createFicha(ficha: InsertFicha): Promise<Ficha>;
  updateFicha(id: string, datos: Partial<InsertFicha>): Promise<Ficha>;
}

export class PostgresStorage implements IStorage {
  
  // ===================
  // MÉTODOS DE USUARIOS
  // ===================
  
  async getUserById(id: string): Promise<Usuario | undefined> {
    const result = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<Usuario | undefined> {
    const result = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUsuario): Promise<Usuario> {
    const result = await db.insert(schema.usuarios).values(user).returning();
    return result[0];
  }

  // ===================
  // MÉTODOS DE PRODUCTOS
  // ===================
  
  async getProductos(filtros?: { busqueda?: string; categoria?: string; ordenar?: string }): Promise<any[]> {
    // Construir condiciones
    const condiciones = [eq(schema.productos.activo, true)];
    
    if (filtros?.busqueda) {
      condiciones.push(like(schema.productos.nombre, `%${filtros.busqueda}%`));
    }

    if (filtros?.categoria) {
      condiciones.push(eq(schema.productos.categoria_id, filtros.categoria));
    }

    // Construir la query base
    let query = db
      .select({
        id: schema.productos.id,
        nombre: schema.productos.nombre,
        descripcion: schema.productos.descripcion,
        precio: schema.productos.precio,
        stock: schema.productos.stock,
        activo: schema.productos.activo,
        creado_en: schema.productos.creado_en,
      })
      .from(schema.productos)
      .where(and(...condiciones));

    // Aplicar ordenamiento
    switch (filtros?.ordenar) {
      case 'precio_asc':
        query = query.orderBy(asc(schema.productos.precio));
        break;
      case 'precio_desc':
        query = query.orderBy(desc(schema.productos.precio));
        break;
      case 'nombre_asc':
        query = query.orderBy(asc(schema.productos.nombre));
        break;
      case 'nombre_desc':
        query = query.orderBy(desc(schema.productos.nombre));
        break;
      default:
        query = query.orderBy(desc(schema.productos.creado_en));
    }

    const productos = await query;

    // Obtener imágenes y promociones para cada producto
    const productosConDetalles = await Promise.all(
      productos.map(async (producto) => {
        const imagenes = await db
          .select()
          .from(schema.imagenes_productos)
          .where(eq(schema.imagenes_productos.producto_id, producto.id));

        const promociones = await db
          .select()
          .from(schema.promociones)
          .where(
            and(
              eq(schema.promociones.producto_id, producto.id),
              eq(schema.promociones.activa, true),
              gte(schema.promociones.fecha_fin, new Date())
            )
          );

        return {
          ...producto,
          imagenes_productos: imagenes,
          promociones: promociones,
        };
      })
    );

    return productosConDetalles;
  }

  async getProductosEnOferta(): Promise<any[]> {
    const promocionesActivas = await db
      .select({
        producto_id: schema.promociones.producto_id,
        porcentaje_descuento: schema.promociones.porcentaje_descuento,
        fecha_fin: schema.promociones.fecha_fin,
      })
      .from(schema.promociones)
      .where(
        and(
          eq(schema.promociones.activa, true),
          gte(schema.promociones.fecha_fin, new Date())
        )
      );

    if (promocionesActivas.length === 0) {
      return [];
    }

    const productosIds = promocionesActivas.map(p => p.producto_id).filter(Boolean);
    
    const productos = await db
      .select()
      .from(schema.productos)
      .where(
        and(
          eq(schema.productos.activo, true),
          or(...productosIds.map(id => eq(schema.productos.id, id!)))
        )
      );

    const productosConDetalles = await Promise.all(
      productos.map(async (producto) => {
        const imagenes = await db
          .select()
          .from(schema.imagenes_productos)
          .where(eq(schema.imagenes_productos.producto_id, producto.id));

        const promociones = await db
          .select()
          .from(schema.promociones)
          .where(
            and(
              eq(schema.promociones.producto_id, producto.id),
              eq(schema.promociones.activa, true),
              gte(schema.promociones.fecha_fin, new Date())
            )
          );

        return {
          ...producto,
          imagenes_productos: imagenes,
          promociones: promociones,
        };
      })
    );

    return productosConDetalles;
  }

  async getProductosAdmin(): Promise<any[]> {
    const productos = await db
      .select()
      .from(schema.productos)
      .orderBy(desc(schema.productos.creado_en));

    const productosConDetalles = await Promise.all(
      productos.map(async (producto) => {
        const imagenes = await db
          .select()
          .from(schema.imagenes_productos)
          .where(eq(schema.imagenes_productos.producto_id, producto.id));

        const categoria = producto.categoria_id ? await db
          .select()
          .from(schema.categorias)
          .where(eq(schema.categorias.id, producto.categoria_id))
          .limit(1) : [];

        return {
          ...producto,
          imagenes_productos: imagenes,
          categoria: categoria[0] || null,
        };
      })
    );

    return productosConDetalles;
  }

  async createProducto(producto: InsertProducto): Promise<Producto> {
    const result = await db.insert(schema.productos).values(producto).returning();
    return result[0];
  }

  async updateProducto(id: string, datos: Partial<InsertProducto>): Promise<Producto> {
    const result = await db
      .update(schema.productos)
      .set(datos)
      .where(eq(schema.productos.id, id))
      .returning();
    return result[0];
  }

  async deleteProducto(id: string): Promise<void> {
    await db.delete(schema.productos).where(eq(schema.productos.id, id));
  }

  // ===================
  // MÉTODOS DE CATEGORÍAS
  // ===================
  
  async getCategorias(): Promise<any[]> {
    return await db
      .select()
      .from(schema.categorias)
      .where(eq(schema.categorias.activa, true))
      .orderBy(asc(schema.categorias.nombre));
  }

  // ===================
  // MÉTODOS DE PROMOCIONES
  // ===================
  
  async getPromocionesAdmin(): Promise<any[]> {
    const promociones = await db
      .select()
      .from(schema.promociones)
      .orderBy(desc(schema.promociones.creado_en));

    const promocionesConProducto = await Promise.all(
      promociones.map(async (promocion) => {
        const producto = promocion.producto_id ? await db
          .select()
          .from(schema.productos)
          .where(eq(schema.productos.id, promocion.producto_id))
          .limit(1) : [];

        return {
          ...promocion,
          producto: producto[0] || null,
        };
      })
    );

    return promocionesConProducto;
  }

  async createPromocion(promocion: InsertPromocion): Promise<Promocion> {
    const result = await db.insert(schema.promociones).values(promocion).returning();
    return result[0];
  }

  async updatePromocion(id: string, datos: Partial<InsertPromocion>): Promise<Promocion> {
    const result = await db
      .update(schema.promociones)
      .set(datos)
      .where(eq(schema.promociones.id, id))
      .returning();
    return result[0];
  }

  async deletePromocion(id: string): Promise<void> {
    await db.delete(schema.promociones).where(eq(schema.promociones.id, id));
  }

  // ===================
  // MÉTODOS DE CARRITO
  // ===================
  
  async getCarritoItems(sesionId: string): Promise<any[]> {
    const items = await db
      .select()
      .from(schema.carrito)
      .where(eq(schema.carrito.sesion_id, sesionId))
      .orderBy(desc(schema.carrito.creado_en));

    const itemsConProducto = await Promise.all(
      items.map(async (item) => {
        const producto = await db
          .select()
          .from(schema.productos)
          .where(eq(schema.productos.id, item.producto_id!))
          .limit(1);

        const imagenes = await db
          .select()
          .from(schema.imagenes_productos)
          .where(eq(schema.imagenes_productos.producto_id, item.producto_id!));

        return {
          ...item,
          producto: {
            ...producto[0],
            imagenes_productos: imagenes,
          },
        };
      })
    );

    return itemsConProducto;
  }

  async addToCarrito(item: InsertCarritoItem): Promise<CarritoItem> {
    // Verificar si el item ya existe en el carrito
    const existing = await db
      .select()
      .from(schema.carrito)
      .where(
        and(
          eq(schema.carrito.sesion_id, item.sesion_id),
          eq(schema.carrito.producto_id, item.producto_id!)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Actualizar cantidad si ya existe
      const result = await db
        .update(schema.carrito)
        .set({ cantidad: existing[0].cantidad + item.cantidad })
        .where(eq(schema.carrito.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      // Crear nuevo item
      const result = await db.insert(schema.carrito).values(item).returning();
      return result[0];
    }
  }

  async updateCarritoItem(id: string, cantidad: number): Promise<CarritoItem> {
    const result = await db
      .update(schema.carrito)
      .set({ cantidad })
      .where(eq(schema.carrito.id, id))
      .returning();
    return result[0];
  }

  async removeFromCarrito(id: string): Promise<void> {
    await db.delete(schema.carrito).where(eq(schema.carrito.id, id));
  }

  async clearCarrito(sesionId: string): Promise<void> {
    await db.delete(schema.carrito).where(eq(schema.carrito.sesion_id, sesionId));
  }

  // ===================
  // MÉTODOS DE PEDIDOS
  // ===================
  
  async createPedido(pedido: InsertPedido): Promise<Pedido> {
    // Generar código único de compra
    const codigoCompra = `KIVO-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    const result = await db
      .insert(schema.pedidos)
      .values({
        ...pedido,
        codigo_compra: codigoCompra,
      })
      .returning();
    
    return result[0];
  }

  async createDetallePedido(detalle: any): Promise<any> {
    const result = await db.insert(schema.detalles_pedidos).values(detalle).returning();
    return result[0];
  }

  async getPedidoByCodigo(codigo: string): Promise<Pedido | undefined> {
    const result = await db
      .select()
      .from(schema.pedidos)
      .where(eq(schema.pedidos.codigo_compra, codigo))
      .limit(1);
    return result[0];
  }

  // ===================
  // MÉTODOS DE FICHAS
  // ===================
  
  async getHistorialFichas(filtros?: { estado?: string; fecha?: string; busqueda?: string }): Promise<any[]> {
    const pedidos = await db
      .select()
      .from(schema.pedidos)
      .orderBy(desc(schema.pedidos.creado_en));

    const pedidosConFichas = await Promise.all(
      pedidos.map(async (pedido) => {
        const ficha = await db
          .select()
          .from(schema.fichas)
          .where(eq(schema.fichas.codigo_compra, pedido.codigo_compra))
          .limit(1);

        return {
          ...pedido,
          ficha: ficha[0] || null,
        };
      })
    );

    // Aplicar filtros
    let resultado = pedidosConFichas;

    if (filtros?.estado) {
      resultado = resultado.filter(item => 
        item.ficha?.estado === filtros.estado
      );
    }

    if (filtros?.busqueda) {
      resultado = resultado.filter(item =>
        item.codigo_compra.toLowerCase().includes(filtros.busqueda!.toLowerCase()) ||
        item.nombre_cliente.toLowerCase().includes(filtros.busqueda!.toLowerCase())
      );
    }

    if (filtros?.fecha) {
      const fechaFiltro = new Date(filtros.fecha);
      resultado = resultado.filter(item => {
        const fechaItem = new Date(item.creado_en!);
        return fechaItem.toDateString() === fechaFiltro.toDateString();
      });
    }

    return resultado;
  }

  async getFichaByCodigo(codigo: string): Promise<Ficha | undefined> {
    const result = await db
      .select()
      .from(schema.fichas)
      .where(eq(schema.fichas.codigo_compra, codigo))
      .limit(1);
    return result[0];
  }

  async createFicha(ficha: InsertFicha): Promise<Ficha> {
    const result = await db.insert(schema.fichas).values(ficha).returning();
    return result[0];
  }

  async updateFicha(id: string, datos: Partial<InsertFicha>): Promise<Ficha> {
    const result = await db
      .update(schema.fichas)
      .set(datos)
      .where(eq(schema.fichas.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new PostgresStorage();
