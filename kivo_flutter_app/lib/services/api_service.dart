import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';
import '../models/user.dart';
import '../models/cart.dart';
import '../models/order.dart';
import '../models/voucher.dart';

class ApiService {
  // Update this URL to match your backend server
  static const String baseUrl = 'http://localhost:5000/api';
  
  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  // Authentication
  Future<AuthResponse> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return AuthResponse.fromJson(data);
    } else {
      throw Exception('Failed to login: ${response.body}');
    }
  }

  // Products
  Future<List<Product>> getProducts({
    String? busqueda,
    String? categoria,
    String? ordenar,
  }) async {
    final queryParams = <String, String>{};
    if (busqueda != null) queryParams['busqueda'] = busqueda;
    if (categoria != null) queryParams['categoria'] = categoria;
    if (ordenar != null) queryParams['ordenar'] = ordenar;

    final uri = Uri.parse('$baseUrl/productos').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products: ${response.body}');
    }
  }

  Future<List<Product>> getProductsOnSale() async {
    final response = await http.get(
      Uri.parse('$baseUrl/productos/ofertas'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products on sale: ${response.body}');
    }
  }

  // Cart
  Future<List<CartItem>> getCartItems(String sessionId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/carrito/$sessionId'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => CartItem.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load cart: ${response.body}');
    }
  }

  Future<CartItem> addToCart(CreateCartItemRequest request) async {
    final response = await http.post(
      Uri.parse('$baseUrl/carrito'),
      headers: _headers,
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return CartItem.fromJson(data);
    } else {
      throw Exception('Failed to add to cart: ${response.body}');
    }
  }

  Future<CartItem> updateCartItem(String id, int quantity) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/carrito/$id'),
      headers: _headers,
      body: jsonEncode({'cantidad': quantity}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return CartItem.fromJson(data);
    } else {
      throw Exception('Failed to update cart item: ${response.body}');
    }
  }

  Future<void> removeFromCart(String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/carrito/$id'),
      headers: _headers,
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to remove from cart: ${response.body}');
    }
  }

  Future<void> clearCart(String sessionId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/carrito/sesion/$sessionId'),
      headers: _headers,
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to clear cart: ${response.body}');
    }
  }

  // Orders
  Future<Order> createOrder(CreateOrderRequest request) async {
    final response = await http.post(
      Uri.parse('$baseUrl/pedidos'),
      headers: _headers,
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return Order.fromJson(data);
    } else {
      throw Exception('Failed to create order: ${response.body}');
    }
  }

  // Vouchers
  Future<Voucher> validateVoucher(String codigoCompra) async {
    final response = await http.post(
      Uri.parse('$baseUrl/fichas/validar'),
      headers: _headers,
      body: jsonEncode({'codigo_compra': codigoCompra}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Voucher.fromJson(data);
    } else {
      throw Exception('Failed to validate voucher: ${response.body}');
    }
  }

  Future<RedeemVoucherResponse> redeemVoucher(String codigoCompra) async {
    final response = await http.post(
      Uri.parse('$baseUrl/fichas/canjear'),
      headers: _headers,
      body: jsonEncode({'codigo_compra': codigoCompra}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return RedeemVoucherResponse.fromJson(data);
    } else {
      throw Exception('Failed to redeem voucher: ${response.body}');
    }
  }
}