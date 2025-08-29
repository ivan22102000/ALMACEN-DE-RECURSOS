import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-accent/20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Bienvenido a <span className="text-kivo-violet">KIVO Store</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tu tienda online favorita en Bolivia. Productos de calidad con nuestro sistema de fichas de fidelidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/productos">
              <Button 
                size="lg" 
                className="bg-kivo-violet text-white hover:bg-kivo-violet/90 px-8 py-3 text-lg"
                data-testid="ver-productos-button"
              >
                Ver Productos
              </Button>
            </Link>
            <Link href="/canjear">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-kivo-violet text-kivo-violet hover:bg-kivo-violet hover:text-white px-8 py-3 text-lg"
                data-testid="canjear-fichas-button"
              >
                Canjear Fichas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
