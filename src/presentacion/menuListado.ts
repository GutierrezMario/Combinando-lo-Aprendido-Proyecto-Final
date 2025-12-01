import { RepositorioTareas } from "../dominio/RepositorioTareas";
import { Tarea } from "../dominio/Tarea";
import { obtenerEntrada } from "../infraestructura/entrada";

export function menuListado(repo: RepositorioTareas, titulo: string, tareas: Tarea[]): void {
  if (tareas.length === 0) {
    console.log(`\n===== ${titulo} =====`);
    console.log("💡 No se encontraron tareas que cumplan con el criterio.");
    return;
  }

  console.log(`\n===== ${titulo} =====`);
  console.log("Orden: 1.Alfabético | 2.Vencimiento | 3.Creación | 4.Dificultad");
  const criterioMap: Record<string, string> = {
    "1": "alfabetico",
    "2": "vencimiento",
    "3": "creacion",
    "4": "dificultad",
  };

  const opcionOrden = (obtenerEntrada<string>("Seleccione criterio (1-4, Enter=3)", "string", "3") ?? "3").trim();
  const criterio = criterioMap[opcionOrden] ?? "creacion";
  const ordenadas = repo.ordenar(tareas, criterio);

  console.log(`\n--- Listado (${ordenadas.length}) | Orden: ${criterio.toUpperCase()} ---`);
  ordenadas.forEach((t, i) => {
    console.log(`[${i + 1}] ${t.toString()}`);
  });

  obtenerEntrada<string>("Presione Enter para volver", "string", "");
}
