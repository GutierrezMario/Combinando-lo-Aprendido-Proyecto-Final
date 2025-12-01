import { RepositorioTareas } from "../dominio/RepositorioTareas";

export function menuEstadisticas(repo: RepositorioTareas): void {
  console.log("\n--- ESTADÍSTICAS ---");

  const porEstado = repo.obtenerEstadisticasEstado();
  console.log(`Total de tareas activas: ${porEstado.total}`);
  console.log("\nDistribución por Estado:");
  Object.entries(porEstado.porEstado).forEach(([estado, data]) => {
    console.log(`- ${estado}: ${data.cantidad} (${data.porcentaje})`);
  });

  const porDif = repo.obtenerEstadisticasDificultad();
  console.log("\nDistribución por Dificultad:");
  Object.entries(porDif.porDificultad).forEach(([dif, data]) => {
    console.log(`- ${dif}: ${data.cantidad} (${data.porcentaje})`);
  });

  console.log("\nTareas de prioridad alta:");
  const altas = repo.obtenerTareasPrioridadAlta();
  if (altas.length > 0) {
    altas.forEach((t) => console.log(`- ${t.toString()}`));
  } else {
    console.log("No hay tareas de prioridad alta activas.");
  }

  console.log("\nTareas vencidas:");
  const vencidas = repo.obtenerTareasVencidas();
  if (vencidas.length > 0) {
    vencidas.forEach((t) => console.log(`- ${t.toString()}`));
  } else {
    console.log("No hay tareas vencidas activas.");
  }
}
