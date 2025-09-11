import 'package:json_annotation/json_annotation.dart';
import 'product.dart';

part 'cart.g.dart';

@JsonSerializable()
class CartItem {
  final String id;
  final String sesionId;
  final String productoId;
  final int cantidad;
  final Product producto;
  final DateTime creadoEn;

  CartItem({
    required this.id,
    required this.sesionId,
    required this.productoId,
    required this.cantidad,
    required this.producto,
    required this.creadoEn,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) => _$CartItemFromJson(json);
  Map<String, dynamic> toJson() => _$CartItemToJson(this);

  double get total => producto.precioConDescuento * cantidad;
}

@JsonSerializable()
class CreateCartItemRequest {
  final String sesionId;
  final String productoId;
  final int cantidad;

  CreateCartItemRequest({
    required this.sesionId,
    required this.productoId,
    required this.cantidad,
  });

  factory CreateCartItemRequest.fromJson(Map<String, dynamic> json) => _$CreateCartItemRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateCartItemRequestToJson(this);
}