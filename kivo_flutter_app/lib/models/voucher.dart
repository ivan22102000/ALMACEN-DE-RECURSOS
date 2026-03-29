import 'package:json_annotation/json_annotation.dart';

part 'voucher.g.dart';

@JsonSerializable()
class Voucher {
  final String id;
  final String codigoCompra;
  final String token;
  final String estado;
  final DateTime fechaExpiracion;
  final DateTime? canjeadoEn;
  final DateTime creadoEn;

  Voucher({
    required this.id,
    required this.codigoCompra,
    required this.token,
    required this.estado,
    required this.fechaExpiracion,
    this.canjeadoEn,
    required this.creadoEn,
  });

  factory Voucher.fromJson(Map<String, dynamic> json) => _$VoucherFromJson(json);
  Map<String, dynamic> toJson() => _$VoucherToJson(this);

  bool get isActive => estado == 'activo';
  bool get isExpired => DateTime.now().isAfter(fechaExpiracion);
  bool get isRedeemed => estado == 'canjeado';
}

@JsonSerializable()
class RedeemVoucherResponse {
  final String message;
  final int descuentoAplicado;

  RedeemVoucherResponse({
    required this.message,
    required this.descuentoAplicado,
  });

  factory RedeemVoucherResponse.fromJson(Map<String, dynamic> json) => _$RedeemVoucherResponseFromJson(json);
  Map<String, dynamic> toJson() => _$RedeemVoucherResponseToJson(this);
}