import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminFichas from './admin-fichas';
import AdminProductos from './admin-productos';
import AdminPromociones from './admin-promociones';

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="fichas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fichas">Fichas</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="promociones">Promociones</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="fichas" className="mt-6">
          <AdminFichas />
        </TabsContent>

        <TabsContent value="productos" className="mt-6">
          <AdminProductos />
        </TabsContent>

        <TabsContent value="promociones" className="mt-6">
          <AdminPromociones />
        </TabsContent>

        <TabsContent value="pedidos" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Gestión de pedidos en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
