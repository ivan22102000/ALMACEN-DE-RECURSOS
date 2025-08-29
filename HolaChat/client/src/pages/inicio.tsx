import HeroSection from '@/components/hero-section';
import PromotionalBanner from '@/components/promotional-banner';
import ProductCard from '@/components/product-card';
import { useQuery } from '@tanstack/react-query';
import type { Producto, ImagenProducto, Promocion } from '@shared/schema';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Link } from 'wouter';

type ProductoConImagenesYPromociones = Producto & {
  imagenes_productos: ImagenProducto[];
  promociones: Promocion[];
};

export default function Inicio() {
  const [codigoCompra, setCodigoCompra] = useState('');

  const { data: productosEnOferta = [], isLoading } = useQuery<ProductoConImagenesYPromociones[]>({
    queryKey: ['/api/productos/ofertas'],
  });

  const handleCanjearFicha = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoCompra.trim()) {
      // Redirect to canje page with code
      window.location.href = `/canjear?codigo=${codigoCompra}`;
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <PromotionalBanner />

      {/* Featured Products with Timers */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ofertas del Día</h2>
            <p className="text-muted-foreground">Aprovecha estos descuentos antes de que terminen</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : productosEnOferta.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosEnOferta.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No hay ofertas activas en este momento</p>
              <Link href="/productos">
                <Button className="bg-kivo-violet text-white hover:bg-kivo-violet/90">
                  Ver Todos los Productos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Loyalty System Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Sistema de Fichas KIVO
              </h2>
              <p className="text-muted-foreground mb-6">
                Gana fichas con cada compra y obtén descuentos exclusivos. Nuestro sistema de fidelidad 
                tipo "Bitcoin" te permite acumular puntos y canjearlos fácilmente.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-kivo-violet rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-foreground">1 ficha por cada compra realizada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-kivo-violet rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-foreground">5 fichas = 10% de descuento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-kivo-violet rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-foreground">Códigos QR únicos para cada compra</span>
                </div>
              </div>
            </div>

            {/* Canjear Fichas Card */}
            <Card>
              <CardHeader>
                <CardTitle>Canjear Fichas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleCanjearFicha} className="space-y-4">
                  <div>
                    <Label htmlFor="codigo-compra">Código de Compra</Label>
                    <Input
                      id="codigo-compra"
                      type="text"
                      placeholder="KIVO-ABC123"
                      value={codigoCompra}
                      onChange={(e) => setCodigoCompra(e.target.value)}
                      data-testid="input-codigo-compra"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-kivo-violet text-white hover:bg-kivo-violet/90"
                    data-testid="button-validar-canjear"
                  >
                    Validar y Canjear
                  </Button>
                </form>

                <div className="text-center">
                  <span className="text-muted-foreground text-sm">o</span>
                </div>

                <Link href="/canjear">
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-kivo-violet text-kivo-violet hover:bg-kivo-violet hover:text-white"
                    data-testid="button-escanear-qr"
                  >
                    Escanear Código QR
                  </Button>
                </Link>

                {/* QR Code Example */}
                <div className="mt-6 p-4 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Ejemplo de código QR de ficha:
                  </p>
                  <div className="w-24 h-24 bg-white border-2 border-kivo-violet rounded mx-auto flex items-center justify-center">
                    <div 
                      className="w-20 h-20 bg-gray-800"
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, black 50%, transparent 50%),
                          linear-gradient(black 50%, transparent 50%)
                        `,
                        backgroundSize: '4px 4px'
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">KIVO-XYZ789</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">KIVO Store</h3>
              <p className="text-muted-foreground">
                Tu tienda online favorita en Bolivia con el mejor sistema de fidelidad.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Navegación</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/" className="hover:text-kivo-violet">Inicio</Link></li>
                <li><Link href="/productos" className="hover:text-kivo-violet">Productos</Link></li>
                <li><Link href="/canjear" className="hover:text-kivo-violet">Canjear Fichas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Soporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-kivo-violet">Ayuda</a></li>
                <li><a href="#" className="hover:text-kivo-violet">Términos</a></li>
                <li><a href="#" className="hover:text-kivo-violet">Privacidad</a></li>
                <li><a href="#" className="hover:text-kivo-violet">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-kivo-violet">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-kivo-violet">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 KIVO Store. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
