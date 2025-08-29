import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatearMoneda } from '@/lib/formatear-moneda';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Carrito() {
  const { items, updateQuantity, removeFromCart, total, clearCart, sesionId } = useCart();
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    direccion_cliente: '',
  });
  const { toast } = useToast();

  const crearPedido = useMutation({
    mutationFn: async (pedidoData: any) => {
      const response = await apiRequest('POST', '/api/pedidos', pedidoData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pedido creado",
        description: `Tu pedido ${data.codigo_compra} ha sido creado exitosamente`,
      });
      clearCart.mutate();
      // Redirect to success page or show confirmation
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el pedido",
      });
    },
  });

  const handleUpdateQuantity = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart.mutate(id);
    } else {
      updateQuantity.mutate({ id, cantidad });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de proceder",
      });
      return;
    }

    const pedidoData = {
      ...formData,
      total: total,
      sesion_id: sesionId,
    };

    crearPedido.mutate(pedidoData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8">
              Explora nuestros productos y agrega algunos a tu carrito
            </p>
            <Link href="/productos">
              <Button 
                className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                data-testid="ir-productos-button"
              >
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const imagenPrincipal = item.producto.imagenes_productos?.find(img => img.es_principal) ||
                                     item.producto.imagenes_productos?.[0];
              
              return (
                <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={imagenPrincipal?.url_imagen || 'https://via.placeholder.com/120x120?text=Sin+Imagen'}
                        alt={item.producto.nombre}
                        className="w-20 h-20 object-cover rounded"
                        data-testid="cart-item-image"
                      />
                      
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-foreground"
                          data-testid="cart-item-name"
                        >
                          {item.producto.nombre}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.producto.descripcion}
                        </p>
                        <p 
                          className="text-lg font-bold text-kivo-violet mt-2"
                          data-testid="cart-item-price"
                        >
                          {formatearMoneda(parseFloat(item.producto.precio))}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                          disabled={updateQuantity.isPending}
                          data-testid="decrease-quantity-button"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <Badge 
                          variant="secondary"
                          className="min-w-[40px] justify-center"
                          data-testid="cart-item-quantity"
                        >
                          {item.cantidad}
                        </Badge>
                        
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                          disabled={updateQuantity.isPending}
                          data-testid="increase-quantity-button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
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
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Resumen y checkout */}
          <div className="space-y-6">
            {/* Resumen del pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span data-testid="subtotal">{formatearMoneda(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span 
                    className="text-kivo-violet"
                    data-testid="total-precio"
                  >
                    {formatearMoneda(total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Formulario de checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input
                      id="nombre"
                      type="text"
                      required
                      value={formData.nombre_cliente}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre_cliente: e.target.value }))}
                      data-testid="input-nombre"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email_cliente}
                      onChange={(e) => setFormData(prev => ({ ...prev, email_cliente: e.target.value }))}
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      required
                      value={formData.telefono_cliente}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono_cliente: e.target.value }))}
                      data-testid="input-telefono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="direccion">Dirección de Entrega</Label>
                    <Input
                      id="direccion"
                      type="text"
                      required
                      value={formData.direccion_cliente}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion_cliente: e.target.value }))}
                      data-testid="input-direccion"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-kivo-violet text-white hover:bg-kivo-violet/90"
                    disabled={crearPedido.isPending}
                    data-testid="finalizar-pedido-button"
                  >
                    {crearPedido.isPending ? 'Procesando...' : 'Finalizar Pedido'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
