import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import CartDrawer from '@/components/cart-drawer';

export default function Navigation() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { cantidadTotal } = useCart();

  // Verificar si hay token de admin
  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem('admin_token');
      setIsAdminAuthenticated(!!token);
    };

    checkAdminAuth();
    
    // Escuchar cambios en localStorage desde otras pestañas
    window.addEventListener('storage', checkAdminAuth);
    
    // Escuchar evento personalizado para cambios en la misma pestaña
    window.addEventListener('adminAuthChanged', checkAdminAuth);
    
    return () => {
      window.removeEventListener('storage', checkAdminAuth);
      window.removeEventListener('adminAuthChanged', checkAdminAuth);
    };
  }, []);

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Productos' },
    { href: '/canjear', label: 'Canjear Fichas' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <span className="text-2xl font-bold text-kivo-violet">KIVO</span>
              <span className="text-sm text-muted-foreground ml-2">Store</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location === item.href
                        ? 'text-kivo-violet'
                        : 'text-muted-foreground hover:text-kivo-violet'
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Cart and Admin */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
                data-testid="cart-button"
              >
                <ShoppingCart className="w-6 h-6" />
                {cantidadTotal > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="cart-count"
                  >
                    {cantidadTotal}
                  </Badge>
                )}
              </Button>

              {isAdminAuthenticated && (
                <Link href="/admin">
                  <Button 
                    className="bg-kivo-violet text-white hover:bg-kivo-violet/90"
                    data-testid="admin-button"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="mobile-menu-button">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <div className="flex flex-col space-y-4 mt-6">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`text-left p-3 rounded-md transition-colors ${
                            location === item.href
                              ? 'bg-kivo-violet text-white'
                              : 'text-foreground hover:bg-accent'
                          }`}
                          data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
