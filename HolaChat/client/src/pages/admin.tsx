import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import AdminFichas from '@/components/admin/admin-fichas';
import AdminProductos from '@/components/admin/admin-productos';
import AdminPromociones from '@/components/admin/admin-promociones';
import { Shield, Lock } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const { toast } = useToast();

  const login = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      setIsAuthenticated(true);
      // Notificar cambio de autenticación a otros componentes
      window.dispatchEvent(new Event('adminAuthChanged'));
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido al panel de administración",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Email o contraseña incorrectos",
      });
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verificar si el token es válido
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(loginData);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    // Notificar cambio de autenticación a otros componentes
    window.dispatchEvent(new Event('adminAuthChanged'));
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-kivo-violet mx-auto mb-4" />
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@kivo.com"
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  data-testid="input-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-kivo-violet text-white hover:bg-kivo-violet/90"
                disabled={login.isPending}
                data-testid="button-login"
              >
                {login.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-secondary rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">Credenciales de demo:</p>
              <p>Email: admin@kivo.com</p>
              <p>Contraseña: password</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona tu tienda KIVO</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>admin@kivo.com</span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fichas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fichas" data-testid="tab-fichas">
              Fichas
            </TabsTrigger>
            <TabsTrigger value="productos" data-testid="tab-productos">
              Productos
            </TabsTrigger>
            <TabsTrigger value="promociones" data-testid="tab-promociones">
              Promociones
            </TabsTrigger>
            <TabsTrigger value="pedidos" data-testid="tab-pedidos">
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fichas">
            <AdminFichas />
          </TabsContent>

          <TabsContent value="productos">
            <AdminProductos />
          </TabsContent>

          <TabsContent value="promociones">
            <AdminPromociones />
          </TabsContent>

          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  La gestión de pedidos estará disponible próximamente.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
