import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatearMoneda } from '@/lib/formatear-moneda';
import QRScanner from '@/components/qr-scanner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminFichas() {
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    fecha: '',
    busqueda: '',
  });
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: historial = [], isLoading } = useQuery({
    queryKey: ['/api/admin/fichas', filtros],
  });

  const generarFicha = useMutation({
    mutationFn: async (codigoCompra: string) => {
      const response = await apiRequest('POST', '/api/admin/fichas/generar', { codigo_compra: codigoCompra });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ficha generada",
        description: "La ficha se ha generado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/fichas'] });
      setSelectedPedido(null);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar la ficha",
      });
    },
  });

  const canjearFichaManual = useMutation({
    mutationFn: async (codigoCompra: string) => {
      const response = await apiRequest('POST', '/api/admin/fichas/canjear-manual', { codigo_compra: codigoCompra });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ficha canjeada",
        description: "La ficha se ha canjeado manualmente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/fichas'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo canjear la ficha",
      });
    },
  });

  const handleQRScan = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.cod_compra) {
        canjearFichaManual.mutate(qrData.cod_compra);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "QR inválido",
        description: "El código QR no tiene el formato correcto",
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo: "default",
      canjeado: "destructive",
      expirado: "secondary",
    } as const;
    
    return (
      <Badge variant={variants[estado as keyof typeof variants] || "secondary"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Historial de Fichas
            <Button
              onClick={() => setIsQRScannerOpen(true)}
              className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
              data-testid="button-escanear-qr"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Escanear QR
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-secondary rounded-lg">
            <div>
              <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
                <SelectTrigger data-testid="select-estado">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="canjeado">Canjeado</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                type="date"
                value={filtros.fecha}
                onChange={(e) => setFiltros(prev => ({ ...prev, fecha: e.target.value }))}
                data-testid="input-fecha"
              />
            </div>
            
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar código..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                  className="pl-10"
                  data-testid="input-busqueda"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" data-testid="button-filtrar">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>

          {/* Tabla */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead className="mobile-visible">Código</TableHead>
                  <TableHead className="mobile-visible">Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ficha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="mobile-visible">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kivo-violet mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : (historial as any[]).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  (historial as any[]).map((item: any) => (
                    <TableRow key={item.id} data-testid={`row-${item.codigo_compra}`}>
                      <TableCell className="font-medium mobile-visible">
                        {item.codigo_compra}
                      </TableCell>
                      <TableCell className="mobile-visible">
                        {format(new Date(item.creado_en), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>{item.nombre_cliente}</TableCell>
                      <TableCell>{formatearMoneda(parseFloat(item.total))}</TableCell>
                      <TableCell>
                        {item.ficha ? (
                          <Badge variant="secondary">{item.ficha.token.slice(0, 8)}...</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin ficha</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.ficha ? getEstadoBadge(item.ficha.estado) : '-'}
                      </TableCell>
                      <TableCell className="mobile-visible">
                        <div className="flex space-x-2">
                          {!item.ficha ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                                  data-testid="button-generar-ficha"
                                >
                                  Generar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Generar Ficha</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>¿Generar ficha para el pedido {item.codigo_compra}?</p>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => generarFicha.mutate(item.codigo_compra)}
                                      disabled={generarFicha.isPending}
                                      className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                                    >
                                      Confirmar
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : item.ficha.estado === 'activo' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => canjearFichaManual.mutate(item.codigo_compra)}
                              disabled={canjearFichaManual.isPending}
                              data-testid="button-canjear-manual"
                            >
                              Canjear
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              {item.ficha.estado === 'canjeado' ? 'Canjeado' : 'Expirado'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Mostrando 1-10 de {historial.length} registros
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button size="sm" className="bg-kivo-violet text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  );
}
