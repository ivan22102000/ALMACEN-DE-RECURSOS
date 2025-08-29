import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatearMoneda } from '@/lib/formatear-moneda';
import { useTemporizadorPromo } from '@/hooks/use-temporizador-promo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Promocion, InsertPromocion } from '@shared/schema';

export default function AdminPromociones() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState<Promocion | null>(null);
  const [formData, setFormData] = useState({
    producto_id: '',
    nombre: '',
    porcentaje_descuento: '0',
    fecha_inicio: '',
    fecha_fin: '',
    activa: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promociones = [], isLoading } = useQuery({
    queryKey: ['/api/promociones/admin'],
  });

  const { data: productos = [] } = useQuery({
    queryKey: ['/api/productos'],
  });

  const crearPromocion = useMutation({
    mutationFn: async (data: InsertPromocion) => {
      const response = await apiRequest('POST', '/api/promociones', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promoción creada",
        description: "La promoción se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promociones'] });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la promoción",
      });
    },
  });

  const actualizarPromocion = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPromocion> }) => {
      const response = await apiRequest('PATCH', `/api/promociones/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promoción actualizada",
        description: "La promoción se ha actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promociones'] });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la promoción",
      });
    },
  });

  const eliminarPromocion = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/promociones/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promoción eliminada",
        description: "La promoción se ha eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promociones'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la promoción",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      producto_id: '',
      nombre: '',
      porcentaje_descuento: '0',
      fecha_inicio: '',
      fecha_fin: '',
      activa: true,
    });
    setEditingPromocion(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (promocion: Promocion) => {
    setEditingPromocion(promocion);
    setFormData({
      producto_id: promocion.producto_id || '',
      nombre: promocion.nombre,
      porcentaje_descuento: promocion.porcentaje_descuento,
      fecha_inicio: format(new Date(promocion.fecha_inicio), 'yyyy-MM-dd\'T\'HH:mm'),
      fecha_fin: format(new Date(promocion.fecha_fin), 'yyyy-MM-dd\'T\'HH:mm'),
      activa: promocion.activa || true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPromocion) {
      actualizarPromocion.mutate({ id: editingPromocion.id, data: formData });
    } else {
      crearPromocion.mutate(formData);
    }
  };

  const getEstadoPromocion = (promocion: Promocion) => {
    const ahora = new Date();
    const inicio = new Date(promocion.fecha_inicio);
    const fin = new Date(promocion.fecha_fin);
    
    if (!promocion.activa) return { estado: 'Inactiva', variant: 'secondary' as const };
    if (ahora < inicio) return { estado: 'Programada', variant: 'default' as const };
    if (ahora > fin) return { estado: 'Expirada', variant: 'destructive' as const };
    return { estado: 'Activa', variant: 'default' as const };
  };

  const PromocionTimer = ({ fechaFin }: { fechaFin: string }) => {
    const tiempoRestante = useTemporizadorPromo(fechaFin);
    
    if (tiempoRestante === 'Expirado') {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    
    return (
      <Badge className="bg-kivo-violet text-white animate-pulse">
        {tiempoRestante}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestión de Promociones
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                  data-testid="button-nueva-promocion"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Promoción
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPromocion ? 'Editar Promoción' : 'Nueva Promoción'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la Promoción</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Oferta Especial Verano"
                      required
                      data-testid="input-nombre"
                    />
                  </div>

                  <div>
                    <Label htmlFor="producto">Producto</Label>
                    <Select 
                      value={formData.producto_id} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, producto_id: value }))}
                    >
                      <SelectTrigger data-testid="select-producto">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {(productos as any[]).map((producto: any) => (
                          <SelectItem key={producto.id} value={producto.id}>
                            {producto.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="descuento">Porcentaje de Descuento (%)</Label>
                    <Input
                      id="descuento"
                      type="number"
                      min="1"
                      max="100"
                      step="0.01"
                      value={formData.porcentaje_descuento}
                      onChange={(e) => setFormData(prev => ({ ...prev, porcentaje_descuento: e.target.value }))}
                      required
                      data-testid="input-descuento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                      <Input
                        id="fecha_inicio"
                        type="datetime-local"
                        value={formData.fecha_inicio}
                        onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                        required
                        data-testid="input-fecha-inicio"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                      <Input
                        id="fecha_fin"
                        type="datetime-local"
                        value={formData.fecha_fin}
                        onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                        required
                        data-testid="input-fecha-fin"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="activa"
                      checked={formData.activa}
                      onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                      className="rounded border-gray-300"
                      data-testid="checkbox-activa"
                    />
                    <Label htmlFor="activa">Promoción activa</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                      disabled={crearPromocion.isPending || actualizarPromocion.isPending}
                      data-testid="button-guardar"
                    >
                      {(crearPromocion.isPending || actualizarPromocion.isPending) ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Tiempo Restante</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kivo-violet mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : (promociones as any[]).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No hay promociones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  promociones.map((promocion: any) => {
                    const { estado, variant } = getEstadoPromocion(promocion);
                    return (
                      <TableRow key={promocion.id} data-testid={`row-${promocion.id}`}>
                        <TableCell className="font-medium">{promocion.nombre}</TableCell>
                        <TableCell>{promocion.producto?.nombre || 'Producto eliminado'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {Math.round(parseFloat(promocion.porcentaje_descuento))}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(promocion.fecha_inicio), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(promocion.fecha_fin), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </TableCell>
                        <TableCell>
                          {estado === 'Activa' ? (
                            <PromocionTimer fechaFin={promocion.fecha_fin} />
                          ) : (
                            <Badge variant="secondary">-</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={variant}>{estado}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(promocion)}
                              data-testid="button-editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => eliminarPromocion.mutate(promocion.id)}
                              disabled={eliminarPromocion.isPending}
                              data-testid="button-eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-kivo-violet" />
                  <div>
                    <p className="text-sm font-medium">Promociones Activas</p>
                    <p className="text-2xl font-bold text-kivo-violet">
                      {promociones.filter((p: any) => getEstadoPromocion(p).estado === 'Activa').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Descuento Promedio</p>
                    <p className="text-2xl font-bold text-green-600">
                      {promociones.length > 0 
                        ? Math.round(promociones.reduce((acc: number, p: any) => acc + parseFloat(p.porcentaje_descuento), 0) / promociones.length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Programadas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {promociones.filter((p: any) => getEstadoPromocion(p).estado === 'Programada').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Expiradas</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {promociones.filter((p: any) => getEstadoPromocion(p).estado === 'Expirada').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
