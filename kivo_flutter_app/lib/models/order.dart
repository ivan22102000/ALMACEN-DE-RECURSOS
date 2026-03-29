import 'package:json_annotation/json_annotation.dart';

part 'order.g.dart';

@JsonSerializable()
class Order {
  final String id;
  final String? codigoCompra;
  final String? nombreCliente;
  final String? telefonoCliente;
  final String? emailCliente;
  final String total;
  final String? metodoEntrega;
  final String? direccionEntrega;
  final String? metodoPago;
  final DateTime creadoEn;

  Order({
    required this.id,
    this.codigoCompra,
    this.nombreCliente,
    this.telefonoCliente,
    this.emailCliente,
    required this.total,
    this.metodoEntrega,
    this.direccionEntrega,
    this.metodoPago,
    required this.creadoEn,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
  Map<String, dynamic> toJson() => _$OrderToJson(this);

  double get totalDouble => double.parse(total);
}

@JsonSerializable()
class CreateOrderRequest {
  final String sesionId;
  final String? nombreCliente;
  final String? telefonoCliente;
  final String? emailCliente;
  final String? metodoEntrega;
  final String? direccionEntrega;
  final String? metodoPago;

  CreateOrderRequest({
    required this.sesionId,
    this.nombreCliente,
    this.telefonoCliente,
    this.emailCliente,
    this.metodoEntrega,
    this.direccionEntrega,
    this.metodoPago,
  });

  factory CreateOrderRequest.fromJson(Map<String, dynamic> json) => _$CreateOrderRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateOrderRequestToJson(this);
}