import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatearMoneda } from '@/lib/formatear-moneda';
import type { Producto, InsertProducto } from '@shared/schema';

export default function AdminProductos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<InsertProducto>({
    nombre: '',
    descripcion: '',
    precio: '0',
    stock: 0,
    categoria_id: '',
    activo: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['/api/productos/admin'],
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['/api/categorias'],
  });

  const crearProducto = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/productos', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Error al crear producto');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Producto creado",
        description: "El producto se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/productos'] });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el producto",
      });
    },
  });

  const actualizarProducto = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PATCH',
        body: data,
      });
      if (!response.ok) throw new Error('Error al actualizar producto');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/productos'] });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el producto",
      });
    },
  });

  const eliminarProducto = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/productos/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/productos'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el producto",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '0',
      stock: 0,
      categoria_id: '',
      activo: true,
    });
    setEditingProduct(null);
    setSelectedFile(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock || 0,
      categoria_id: producto.categoria_id || '',
      activo: producto.activo || true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value?.toString() || '');
    });
    
    if (selectedFile) {
      formDataToSend.append('imagen', selectedFile);
    }

    if (editingProduct) {
      actualizarProducto.mutate({ id: editingProduct.id, data: formDataToSend });
    } else {
      crearProducto.mutate(formDataToSend);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo y tamaño
      const validTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Tipo de archivo inválido",
          description: "Solo se permiten archivos JPEG y PNG",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "Archivo muy grande",
          description: "El archivo no debe superar los 5MB",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestión de Productos
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                  data-testid="button-nuevo-producto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre del Producto</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                        data-testid="input-nombre"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select 
                        value={formData.categoria_id || ''} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
                      >
                        <SelectTrigger data-testid="select-categoria">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {(categorias as any[]).map((categoria: any) => (
                            <SelectItem key={categoria.id} value={categoria.id}>
                              {categoria.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      rows={3}
                      data-testid="textarea-descripcion"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precio">Precio (BOB)</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio}
                        onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                        required
                        data-testid="input-precio"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        data-testid="input-stock"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="imagen">Imagen del Producto</Label>
                    <div className="mt-1 flex items-center space-x-4">
                      <Input
                        id="imagen"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-kivo-violet file:text-white hover:file:bg-kivo-violet/90"
                        data-testid="input-imagen"
                      />
                      {selectedFile && (
                        <Badge variant="secondary">{selectedFile.name}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Solo JPEG/PNG, máximo 5MB
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="activo"
                      checked={formData.activo || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                      className="rounded border-gray-300"
                      data-testid="checkbox-activo"
                    />
                    <Label htmlFor="activo">Producto activo</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                      disabled={crearProducto.isPending || actualizarProducto.isPending}
                      data-testid="button-guardar"
                    >
                      {(crearProducto.isPending || actualizarProducto.isPending) ? 'Guardando...' : 'Guardar'}
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
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kivo-violet mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : (productos as any[]).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay productos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  productos.map((producto: any) => (
                    <TableRow key={producto.id} data-testid={`row-${producto.id}`}>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {producto.imagenes_productos?.[0] ? (
                            <img
                              src={producto.imagenes_productos[0].url_imagen}
                              alt={producto.nombre}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{producto.nombre}</TableCell>
                      <TableCell>{producto.categoria?.nombre || 'Sin categoría'}</TableCell>
                      <TableCell>{formatearMoneda(parseFloat(producto.precio))}</TableCell>
                      <TableCell>
                        <Badge variant={producto.stock > 0 ? "default" : "destructive"}>
                          {producto.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={producto.activo ? "default" : "secondary"}>
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(producto)}
                            data-testid="button-editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => eliminarProducto.mutate(producto.id)}
                            disabled={eliminarProducto.isPending}
                            data-testid="button-eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
