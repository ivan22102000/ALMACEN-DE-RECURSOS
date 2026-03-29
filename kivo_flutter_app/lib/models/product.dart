import 'package:json_annotation/json_annotation.dart';

part 'product.g.dart';

@JsonSerializable()
class Product {
  final String id;
  final String nombre;
  final String? descripcion;
  final String precio;
  final int stock;
  final String? categoriaId;
  final bool activo;
  final DateTime creadoEn;
  final List<ProductImage>? imagenesProductos;
  final List<Promotion>? promociones;

  Product({
    required this.id,
    required this.nombre,
    this.descripcion,
    required this.precio,
    required this.stock,
    this.categoriaId,
    required this.activo,
    required this.creadoEn,
    this.imagenesProductos,
    this.promociones,
  });

  factory Product.fromJson(Map<String, dynamic> json) => _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);

  double get precioDouble => double.parse(precio);
  
  String get imagePrincipal {
    if (imagenesProductos?.isNotEmpty == true) {
      final principal = imagenesProductos!.firstWhere(
        (img) => img.esPrincipal,
        orElse: () => imagenesProductos!.first,
      );
      return principal.urlImagen;
    }
    return 'https://via.placeholder.com/300x300?text=Sin+Imagen';
  }

  double get precioConDescuento {
    if (promociones?.isNotEmpty == true) {
      final descuento = promociones!.first.porcentajeDescuento;
      return precioDouble * (1 - descuento / 100);
    }
    return precioDouble;
  }

  bool get tieneDescuento => promociones?.isNotEmpty == true;
}

@JsonSerializable()
class ProductImage {
  final String id;
  final String productoId;
  final String urlImagen;
  final bool esPrincipal;
  final DateTime creadoEn;

  ProductImage({
    required this.id,
    required this.productoId,
    required this.urlImagen,
    required this.esPrincipal,
    required this.creadoEn,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) => _$ProductImageFromJson(json);
  Map<String, dynamic> toJson() => _$ProductImageToJson(this);
}

@JsonSerializable()
class Promotion {
  final String id;
  final String productoId;
  final String nombre;
  final double porcentajeDescuento;
  final DateTime fechaInicio;
  final DateTime fechaFin;
  final bool activa;

  Promotion({
    required this.id,
    required this.productoId,
    required this.nombre,
    required this.porcentajeDescuento,
    required this.fechaInicio,
    required this.fechaFin,
    required this.activa,
  });

  factory Promotion.fromJson(Map<String, dynamic> json) => _$PromotionFromJson(json);
  Map<String, dynamic> toJson() => _$PromotionToJson(this);
}