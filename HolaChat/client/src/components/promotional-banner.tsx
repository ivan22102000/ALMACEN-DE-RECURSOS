import { useTemporizadorPromo } from '@/hooks/use-temporizador-promo';
import { Flame } from 'lucide-react';

export default function PromotionalBanner() {
  // Fecha de ejemplo - en producción vendría de la API
  const fechaFinPromo = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000); // 2 días 14 horas
  const tiempoRestante = useTemporizadorPromo(fechaFinPromo);

  return (
    <section className="bg-kivo-violet text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2">
          <Flame className="w-5 h-5" />
          <span className="font-medium">¡Ofertas especiales por tiempo limitado! Hasta 50% de descuento</span>
          <div 
            className="font-bold animate-pulse" 
            data-testid="promocion-timer"
          >
            {tiempoRestante}
          </div>
        </div>
      </div>
    </section>
  );
}
