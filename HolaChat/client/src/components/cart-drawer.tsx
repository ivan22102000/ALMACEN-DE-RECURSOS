import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatearMoneda } from '@/lib/formatear-moneda';
import { Link } from 'wouter';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, isLoading } = useCart();

  const handleUpdateQuantity = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart.mutate(id);
    } else {
      updateQuantity.mutate({ id, cantidad });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle data-testid="cart-title">Carrito de Compras</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kivo-violet"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
                <Link href="/productos">
                  <Button 
                    className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                    onClick={onClose}
                    data-testid="ir-productos-button"
                  >
                    Ver Productos
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => {
                  const imagenPrincipal = item.producto.imagenes_productos?.find(img => img.es_principal) ||
                                         item.producto.imagenes_productos?.[0];
                  
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <img
                        src={imagenPrincipal?.url_imagen || 'https://via.placeholder.com/80x80?text=Sin+Imagen'}
                        alt={item.producto.nombre}
                        className="w-16 h-16 object-cover rounded"
                        data-testid="cart-item-image"
                      />
                      
                      <div className="flex-1">
                        <h4 
                          className="font-medium text-foreground"
                          data-testid="cart-item-name"
                        >
                          {item.producto.nombre}
                        </h4>
                        <p 
                          className="text-sm text-muted-foreground"
                          data-testid="cart-item-price"
                        >
                          {formatearMoneda(parseFloat(item.producto.precio))}
                        </p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                            disabled={updateQuantity.isPending}
                            data-testid="decrease-quantity-button"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <Badge 
                            variant="secondary"
                            data-testid="cart-item-quantity"
                          >
                            {item.cantidad}
                          </Badge>
                          
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                            disabled={updateQuantity.isPending}
                            data-testid="increase-quantity-button"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => removeFromCart.mutate(item.id)}
                        disabled={removeFromCart.isPending}
                        data-testid="remove-item-button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total:</span>
                  <span 
                    className="text-xl font-bold text-kivo-violet"
                    data-testid="cart-total"
                  >
                    {formatearMoneda(total)}
                  </span>
                </div>
                
                <Separator />
                
                <Link href="/carrito">
                  <Button 
                    className="w-full bg-kivo-violet text-white hover:bg-kivo-violet/90"
                    onClick={onClose}
                    data-testid="proceed-checkout-button"
                  >
                    Proceder al Pago
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
