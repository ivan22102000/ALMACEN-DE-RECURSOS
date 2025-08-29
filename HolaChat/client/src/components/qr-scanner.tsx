import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Usar cámara trasera en móviles
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const simulateQRScan = () => {
    // Simular un QR escaneado para propósitos de demo
    const mockQR = JSON.stringify({
      cod_ficha: "ABC123DEF456",
      cod_compra: "KIVO-001"
    });
    
    onScan(mockQR);
    toast({
      title: "QR Escaneado",
      description: "Código QR detectado correctamente",
    });
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Escanear Código QR
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-testid="close-scanner-button"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-gray-900 rounded-lg h-64 flex items-center justify-center overflow-hidden">
            {error ? (
              <div className="text-center text-white p-4">
                <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={startCamera}
                  data-testid="retry-camera-button"
                >
                  Reintentar
                </Button>
              </div>
            ) : isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  data-testid="camera-video"
                />
                
                {/* QR Scanner overlay */}
                <div 
                  className="absolute border-2 border-kivo-violet w-48 h-48 rounded-lg"
                  style={{ 
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' 
                  }}
                  data-testid="scan-overlay"
                />
              </>
            ) : (
              <div className="text-white text-center">
                <Camera className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">Iniciando cámara...</p>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Coloca el código QR dentro del marco para escanearlo
            </p>
            
            {/* Botón temporal para demo */}
            <Button
              variant="outline"
              size="sm"
              onClick={simulateQRScan}
              data-testid="simulate-scan-button"
            >
              Simular Escaneo (Demo)
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClose}
              data-testid="cancel-scan-button"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
