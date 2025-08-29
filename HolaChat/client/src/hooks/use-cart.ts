import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { CarritoItem, Producto, ImagenProducto } from '@shared/schema';

interface CarritoItemConProducto extends CarritoItem {
  producto: Producto & {
    imagenes_productos: ImagenProducto[];
  };
}

export const useCart = () => {
  const [sesionId, setSesionId] = useState<string>('');
  const queryClient = useQueryClient();

  // Generar sesion ID única si no existe
  useEffect(() => {
    let id = localStorage.getItem('sesion_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('sesion_id', id);
    }
    setSesionId(id);
  }, []);

  const { data: items = [], isLoading } = useQuery<CarritoItemConProducto[]>({
    queryKey: ['/api/carrito', sesionId],
    enabled: !!sesionId,
  });

  const addToCart = useMutation({
    mutationFn: async ({ productoId, cantidad }: { productoId: string; cantidad: number }) => {
      const response = await apiRequest('POST', '/api/carrito', {
        sesion_id: sesionId,
        producto_id: productoId,
        cantidad,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carrito', sesionId] });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, cantidad }: { id: string; cantidad: number }) => {
      const response = await apiRequest('PATCH', `/api/carrito/${id}`, { cantidad });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carrito', sesionId] });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/carrito/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carrito', sesionId] });
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/carrito/sesion/${sesionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carrito', sesionId] });
    },
  });

  const total = items.reduce((sum, item) => 
    sum + (parseFloat(item.producto.precio) * item.cantidad), 0
  );

  const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    items,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    cantidadTotal,
    sesionId,
  };
};
