export function cambiarFecha(fecha) {
  return fecha ? new Date(fecha).toISOString().split("T")[0] : "";
}
export function calcularDiasRestantes(fechaVencimiento) {
  const ahora = new Date();
  const vencimiento = new Date(fechaVencimiento);

  const diferenciaMs = vencimiento - ahora;
  const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  if (diasRestantes < 0) {
    return `Se venció hace ${Math.abs(diasRestantes)} día(s)`;
  } else if (diasRestantes === 0) {
    return "Se vence hoy";
  } else {
    return `Quedan ${diasRestantes} día(s) para vencer`;
  }
}
