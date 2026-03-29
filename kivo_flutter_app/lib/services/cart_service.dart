import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart.dart';
import '../models/product.dart';
import 'api_service.dart';

class CartService extends ChangeNotifier {
  final ApiService _apiService;
  List<CartItem> _items = [];
  bool _isLoading = false;
  String? _sessionId;

  CartService(this._apiService);

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;
  int get itemCount => _items.fold(0, (sum, item) => sum + item.cantidad);
  double get total => _items.fold(0.0, (sum, item) => sum + item.total);

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _sessionId = prefs.getString('session_id');
    
    if (_sessionId == null) {
      _sessionId = DateTime.now().millisecondsSinceEpoch.toString();
      await prefs.setString('session_id', _sessionId!);
    }
    
    await loadCart();
  }

  Future<void> loadCart() async {
    if (_sessionId == null) return;
    
    _isLoading = true;
    notifyListeners();

    try {
      _items = await _apiService.getCartItems(_sessionId!);
    } catch (e) {
      debugPrint('Error loading cart: $e');
      _items = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> addToCart(Product product, {int quantity = 1}) async {
    if (_sessionId == null) return false;

    try {
      final request = CreateCartItemRequest(
        sesionId: _sessionId!,
        productoId: product.id,
        cantidad: quantity,
      );

      // Check if item already exists in cart
      final existingItemIndex = _items.indexWhere(
        (item) => item.productoId == product.id,
      );

      if (existingItemIndex != -1) {
        // Update existing item
        final existingItem = _items[existingItemIndex];
        final newQuantity = existingItem.cantidad + quantity;
        await updateQuantity(existingItem.id, newQuantity);
      } else {
        // Add new item
        final newItem = await _apiService.addToCart(request);
        _items.add(newItem);
        notifyListeners();
      }

      return true;
    } catch (e) {
      debugPrint('Error adding to cart: $e');
      return false;
    }
  }

  Future<bool> updateQuantity(String itemId, int quantity) async {
    try {
      if (quantity <= 0) {
        return await removeFromCart(itemId);
      }

      final updatedItem = await _apiService.updateCartItem(itemId, quantity);
      final index = _items.indexWhere((item) => item.id == itemId);
      
      if (index != -1) {
        _items[index] = updatedItem;
        notifyListeners();
      }

      return true;
    } catch (e) {
      debugPrint('Error updating cart item: $e');
      return false;
    }
  }

  Future<bool> removeFromCart(String itemId) async {
    try {
      await _apiService.removeFromCart(itemId);
      _items.removeWhere((item) => item.id == itemId);
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Error removing from cart: $e');
      return false;
    }
  }

  Future<bool> clearCart() async {
    if (_sessionId == null) return false;

    try {
      await _apiService.clearCart(_sessionId!);
      _items.clear();
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Error clearing cart: $e');
      return false;
    }
  }

  int getProductQuantity(String productId) {
    final item = _items.firstWhere(
      (item) => item.productoId == productId,
      orElse: () => CartItem(
        id: '',
        sesionId: '',
        productoId: '',
        cantidad: 0,
        producto: Product(
          id: '',
          nombre: '',
          precio: '0',
          stock: 0,
          activo: false,
          creadoEn: DateTime.now(),
        ),
        creadoEn: DateTime.now(),
      ),
    );
    return item.cantidad;
  }
}