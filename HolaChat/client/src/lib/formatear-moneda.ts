export const formatearMoneda = (monto: number): string => {
  return new Intl.NumberFormat('es-BO', { 
    style: 'currency', 
    currency: 'BOB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(monto);
};

export const formatearNumero = (numero: number): string => {
  return new Intl.NumberFormat('es-BO').format(numero);
};
