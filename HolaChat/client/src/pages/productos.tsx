import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import type { Producto, ImagenProducto, Promocion } from '@shared/schema';

type ProductoConImagenesYPromociones = Producto & {
  imagenes_productos: ImagenProducto[];
  promociones: Promocion[];
};

export default function Productos() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ordenar, setOrdenar] = useState('');

  const { data: productos = [], isLoading } = useQuery<ProductoConImagenesYPromociones[]>({
    queryKey: ['/api/productos', { busqueda, categoria, ordenar }],
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['/api/categorias'],
  });

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se actualiza automáticamente por el estado
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Productos</h1>
          <p className="text-muted-foreground">
            Explora nuestro catálogo completo de productos
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <form onSubmit={handleBuscar} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                  data-testid="input-busqueda"
                />
              </form>
            </div>
            
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger data-testid="select-categoria">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                {categorias.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ordenar} onValueChange={setOrdenar}>
              <SelectTrigger data-testid="select-ordenar">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Por defecto</SelectItem>
                <SelectItem value="precio_asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="precio_desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="nombre_asc">Nombre: A-Z</SelectItem>
                <SelectItem value="nombre_desc">Nombre: Z-A</SelectItem>
                <SelectItem value="mas_recientes">Más Recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : productos.length > 0 ? (
          <>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="productos-grid"
            >
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Pagination placeholder */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button className="bg-kivo-violet text-white">
                  1
                </Button>
                <Button variant="outline">
                  2
                </Button>
                <Button variant="outline">
                  3
                </Button>
                <Button variant="outline">
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setBusqueda('');
                setCategoria('');
                setOrdenar('');
              }}
              data-testid="limpiar-filtros-button"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
