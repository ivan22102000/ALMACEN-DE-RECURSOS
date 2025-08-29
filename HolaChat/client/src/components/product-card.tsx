import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { useTemporizadorPromo } from '@/hooks/use-temporizador-promo';
import { formatearMoneda } from '@/lib/formatear-moneda';
import type { Producto, ImagenProducto, Promocion } from '@shared/schema';

interface ProductCardProps {
  producto: Producto & {
    imagenes_productos: ImagenProducto[];
    promociones: Promocion[];
  };
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const promocionActiva = producto.promociones?.find(p => 
    p.activa && new Date(p.fecha_fin) > new Date()
  );

  const tiempoRestante = promocionActiva ? 
    useTemporizadorPromo(promocionActiva.fecha_fin) : null;

  const imagenPrincipal = producto.imagenes_productos?.find(img => img.es_principal) ||
                         producto.imagenes_productos?.[0];

  const precioOriginal = parseFloat(producto.precio);
  const precioConDescuento = promocionActiva ? 
    precioOriginal * (1 - parseFloat(promocionActiva.porcentaje_descuento) / 100) : 
    precioOriginal;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart.mutateAsync({
        productoId: producto.id,
        cantidad: 1
      });
      
      toast({
        title: "Producto agregado",
        description: `${producto.nombre} se agregó al carrito`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative">
        {/* Timer Badge */}
        {promocionActiva && tiempoRestante && tiempoRestante !== 'Expirado' && (
          <div className="absolute top-2 right-2 z-10">
            <Badge 
              className="bg-kivo-violet text-white timer-badge"
              data-testid="timer-badge"
            >
              {tiempoRestante}
            </Badge>
          </div>
        )}

        {/* Discount Badge */}
        {promocionActiva && (
          <div className="absolute top-2 left-2 z-10">
            <Badge 
              variant="destructive"
              data-testid="discount-badge"
            >
              -{Math.round(parseFloat(promocionActiva.porcentaje_descuento))}%
            </Badge>
          </div>
        )}

        <img
          src={imagenPrincipal?.url_imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
          alt={producto.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid="product-image"
        />
      </div>

      <CardContent className="p-4">
        <h3 
          className="font-semibold text-foreground mb-2" 
          data-testid="product-name"
        >
          {producto.nombre}
        </h3>
        
        <p 
          className="text-muted-foreground text-sm mb-3 line-clamp-2" 
          data-testid="product-description"
        >
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {promocionActiva && (
              <span 
                className="text-muted-foreground line-through text-sm"
                data-testid="original-price"
              >
                {formatearMoneda(precioOriginal)}
              </span>
            )}
            <span 
              className={`text-lg font-bold ${promocionActiva ? 'text-kivo-violet' : 'text-foreground'}`}
              data-testid="sale-price"
            >
              {formatearMoneda(precioConDescuento)}
            </span>
          </div>
          
          <Button
            size="sm"
            className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
            onClick={handleAddToCart}
            disabled={isLoading || addToCart.isPending}
            data-testid="add-to-cart-button"
          >
            {isLoading || addToCart.isPending ? 'Agregando...' : 'Agregar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
