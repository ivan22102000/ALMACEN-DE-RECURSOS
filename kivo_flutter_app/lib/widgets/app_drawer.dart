import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.primaryContainer,
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.store,
                  size: 48,
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
                const SizedBox(height: 12),
                Text(
                  'Kivo Store',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Theme.of(context).colorScheme.onPrimary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Consumer<AuthService>(
                  builder: (context, authService, child) {
                    if (authService.isLoggedIn) {
                      return Text(
                        'Hola, ${authService.currentUser?.nombre}',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onPrimary,
                        ),
                      );
                    }
                    return Text(
                      'Invitado',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Inicio'),
            onTap: () {
              Navigator.pop(context);
              context.go('/');
            },
          ),
          
          ListTile(
            leading: const Icon(Icons.shopping_bag),
            title: const Text('Productos'),
            onTap: () {
              Navigator.pop(context);
              context.go('/productos');
            },
          ),
          
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: const Text('Carrito'),
            onTap: () {
              Navigator.pop(context);
              context.go('/carrito');
            },
          ),
          
          ListTile(
            leading: const Icon(Icons.qr_code_scanner),
            title: const Text('Canjear Ficha'),
            onTap: () {
              Navigator.pop(context);
              context.go('/canjear');
            },
          ),
          
          const Divider(),
          
          Consumer<AuthService>(
            builder: (context, authService, child) {
              if (authService.isLoggedIn) {
                return Column(
                  children: [
                    if (authService.isAdmin)
                      ListTile(
                        leading: const Icon(Icons.admin_panel_settings),
                        title: const Text('Administración'),
                        onTap: () {
                          Navigator.pop(context);
                          context.go('/admin');
                        },
                      ),
                    
                    ListTile(
                      leading: const Icon(Icons.logout),
                      title: const Text('Cerrar Sesión'),
                      onTap: () async {
                        Navigator.pop(context);
                        await authService.logout();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Sesión cerrada'),
                            ),
                          );
                        }
                      },
                    ),
                  ],
                );
              } else {
                return ListTile(
                  leading: const Icon(Icons.login),
                  title: const Text('Iniciar Sesión'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/login');
                  },
                );
              }
            },
          ),
          
          const Divider(),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Versión 1.0.0',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}