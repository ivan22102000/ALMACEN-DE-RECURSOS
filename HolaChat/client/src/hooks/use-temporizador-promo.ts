import { useState, useEffect } from 'react';

export const useTemporizadorPromo = (fechaFin: Date | string) => {
  const [tiempoRestante, setTiempoRestante] = useState('');

  useEffect(() => {
    const calcularTiempo = () => {
      const ahora = new Date();
      const fin = new Date(fechaFin);
      const diferencia = fin.getTime() - ahora.getTime();

      if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        
        if (dias > 0) {
          setTiempoRestante(`${dias}d ${horas}h`);
        } else if (horas > 0) {
          setTiempoRestante(`${horas}h`);
        } else {
          const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
          setTiempoRestante(`${minutos}m`);
        }
      } else {
        setTiempoRestante('Expirado');
      }
    };

    calcularTiempo();
    
    // Actualizar cada hora según los requerimientos
    const intervalo = setInterval(calcularTiempo, 3600000);

    return () => clearInterval(intervalo);
  }, [fechaFin]);

  return tiempoRestante;
};
