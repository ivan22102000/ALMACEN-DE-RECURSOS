import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  final ApiService _apiService;
  User? _currentUser;
  String? _token;
  bool _isLoading = false;

  AuthService(this._apiService);

  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _currentUser != null && _token != null;
  bool get isAdmin => _currentUser?.esAdministrador ?? false;

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    
    if (_token != null) {
      _apiService.setAuthToken(_token!);
      final userJson = prefs.getString('current_user');
      if (userJson != null) {
        try {
          _currentUser = User.fromJson(Map<String, dynamic>.from(
            jsonDecode(userJson) as Map
          ));
          notifyListeners();
        } catch (e) {
          // If user data is corrupted, clear it
          await logout();
        }
      }
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final authResponse = await _apiService.login(email, password);
      _token = authResponse.token;
      _currentUser = authResponse.user;
      
      _apiService.setAuthToken(_token!);
      
      // Save to persistent storage
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', _token!);
      await prefs.setString('current_user', jsonEncode(_currentUser!.toJson()));
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    _token = null;
    _apiService.clearAuthToken();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('current_user');
    
    notifyListeners();
  }
}