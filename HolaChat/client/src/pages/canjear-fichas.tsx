import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, QrCode, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import QRScanner from '@/components/qr-scanner';

export default function CanjearFichas() {
  const [codigoCompra, setCodigoCompra] = useState('');
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [fichaValidada, setFichaValidada] = useState<any>(null);
  const { toast } = useToast();

  const validarFicha = useMutation({
    mutationFn: async (codigo: string) => {
      const response = await apiRequest('POST', '/api/fichas/validar', { codigo_compra: codigo });
      return response.json();
    },
    onSuccess: (data) => {
      setFichaValidada(data);
      toast({
        title: "Ficha encontrada",
        description: "La ficha es válida y puede ser canjeada",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ficha no válida",
        description: error.message || "No se encontró una ficha válida para este código",
      });
      setFichaValidada(null);
    },
  });

  const canjearFicha = useMutation({
    mutationFn: async (codigo: string) => {
      const response = await apiRequest('POST', '/api/fichas/canjear', { codigo_compra: codigo });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Ficha canjeada",
        description: `Descuento aplicado: ${data.descuento_aplicado}%`,
      });
      setFichaValidada(null);
      setCodigoCompra('');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al canjear",
        description: error.message || "No se pudo canjear la ficha",
      });
    },
  });

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoCompra.trim()) {
      validarFicha.mutate(codigoCompra.trim());
    }
  };

  const handleCanjear = () => {
    if (fichaValidada?.codigo_compra) {
      canjearFicha.mutate(fichaValidada.codigo_compra);
    }
  };

  const handleQRScan = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.cod_compra) {
        setCodigoCompra(qrData.cod_compra);
        validarFicha.mutate(qrData.cod_compra);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "QR inválido",
        description: "El código QR no tiene el formato correcto",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Canjear Fichas <span className="text-kivo-violet">KIVO</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Usa tus fichas de fidelidad para obtener descuentos exclusivos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de canje */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-kivo-violet" />
                <span>Validar Ficha</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleValidar} className="space-y-4">
                <div>
                  <Label htmlFor="codigo-compra">Código de Compra</Label>
                  <Input
                    id="codigo-compra"
                    type="text"
                    placeholder="KIVO-ABC123"
                    value={codigoCompra}
                    onChange={(e) => setCodigoCompra(e.target.value)}
                    className="mt-1"
                    data-testid="input-codigo-compra"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-kivo-violet text-white hover:bg-kivo-violet/90"
                  disabled={validarFicha.isPending}
                  data-testid="button-validar"
                >
                  {validarFicha.isPending ? 'Validando...' : 'Validar Ficha'}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-muted-foreground text-sm">o</span>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 border-kivo-violet text-kivo-violet hover:bg-kivo-violet hover:text-white"
                onClick={() => setIsQRScannerOpen(true)}
                data-testid="button-escanear-qr"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Escanear Código QR
              </Button>

              {/* Resultado de validación */}
              {fichaValidada && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Ficha Válida</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Código:</span>
                      <Badge variant="secondary">{fichaValidada.codigo_compra}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <Badge className="bg-green-100 text-green-800">{fichaValidada.estado}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Descuento disponible:</span>
                      <span className="font-bold text-kivo-violet">10%</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
                    onClick={handleCanjear}
                    disabled={canjearFicha.isPending}
                    data-testid="button-canjear"
                  >
                    {canjearFicha.isPending ? 'Canjeando...' : 'Canjear Ficha'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del sistema */}
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-kivo-violet rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Realiza una compra</h4>
                    <p className="text-sm text-muted-foreground">
                      Por cada compra que hagas, recibirás una ficha de fidelidad
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-kivo-violet rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Recibe tu código QR</h4>
                    <p className="text-sm text-muted-foreground">
                      Te enviaremos un código QR único por email o WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-kivo-violet rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Canjea tu descuento</h4>
                    <p className="text-sm text-muted-foreground">
                      Usa el código o escanea el QR para obtener tu descuento
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-kivo-violet/10 border border-kivo-violet/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-kivo-violet" />
                  <span className="font-medium text-kivo-violet">Importante</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Las fichas expiran después de 30 días</li>
                  <li>• Cada ficha puede usarse solo una vez</li>
                  <li>• 5 fichas = 10% de descuento</li>
                  <li>• El descuento se aplica en tu próxima compra</li>
                </ul>
              </div>

              {/* QR Code Example */}
              <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Ejemplo de código QR:
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

      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  );
}
