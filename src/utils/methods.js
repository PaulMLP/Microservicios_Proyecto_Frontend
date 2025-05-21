export function cambiarFecha(fecha) {
  return fecha ? new Date(fecha).toISOString().split("T")[0] : "";
}
