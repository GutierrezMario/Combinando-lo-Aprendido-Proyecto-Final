import { Tarea } from "./Tarea";
import { guardarTareasJson, cargarTareasJson } from "../infraestructura/persistencia";
import { EstadoTarea, DificultadTarea } from "./enums";

export class RepositorioTareas {
  private tareas: Tarea[];

  constructor() {
    this.tareas = cargarTareasJson().map((d) => Tarea.reconstruir(d));
  }


  public agregar(tarea: Tarea): void {
    this.tareas.push(tarea);
    guardarTareasJson(this.tareas);
  }

  public eliminarLogica(id: string): boolean {
    const tarea = this.obtenerPorId(id);
    if (tarea && !tarea.eliminadaLogica) {
      tarea.marcarEliminada();
      guardarTareasJson(this.tareas);
      return true;
    }
    return false;
  }

  public actualizar(): void {
    guardarTareasJson(this.tareas);
  }


  public obtenerPorId(id: string): Tarea | undefined {
    return this.tareas.find((t) => t.id === id);
  }

  public obtenerTodasActivas(): Tarea[] {
    return this.tareas.filter((t) => !t.eliminadaLogica);
  }

  public buscarPorTitulo(clave: string): Tarea[] {
    const c = (clave ?? "").toLowerCase();
    return this.obtenerTodasActivas().filter((t) => t.titulo.toLowerCase().includes(c));
  }

  public obtenerTareasRelacionadas(clave: string): Tarea[] {
    const c = (clave ?? "").toLowerCase();
    return this.obtenerTodasActivas().filter((t) => t.esRelacionada(c));
  }

  public ordenar(tareas: Tarea[], criterio: string): Tarea[] {
    const estrategias: Record<string, (a: Tarea, b: Tarea) => number> = {
      alfabetico: (a, b) => a.titulo.localeCompare(b.titulo),
      vencimiento: (a, b) =>
        (a.fechaVencimiento?.getTime() ?? Infinity) - (b.fechaVencimiento?.getTime() ?? Infinity),
      creacion: (a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime(),
      dificultad: (a, b) => a.dificultad - b.dificultad,
    };
    const sortFn = estrategias[criterio] ?? estrategias["creacion"];
    return tareas.slice().sort(sortFn);
  }


  public obtenerEstadisticasEstado(): {
    total: number;
    porEstado: Record<string, { cantidad: number; porcentaje: string }>;
  } {
    const activas = this.obtenerTodasActivas();
    const total = activas.length;
    const conteo = activas
      .map((t) => t.estado)
      .reduce((acc: Record<string, number>, e) => {
        acc[e] = (acc[e] ?? 0) + 1;
        return acc;
      }, {});
    const porEstado = Object.keys(conteo).reduce((acc, estado) => {
      const cant = conteo[estado];
      acc[estado] = {
        cantidad: cant,
        porcentaje: total ? `${((cant / total) * 100).toFixed(2)}%` : "0.00%",
      };
      return acc;
    }, {} as Record<string, { cantidad: number; porcentaje: string }>);
    return { total, porEstado };
  }

  public obtenerEstadisticasDificultad(): {
    total: number;
    porDificultad: Record<DificultadTarea, { cantidad: number; porcentaje: string }>;
  } {
    const activas = this.obtenerTodasActivas();
    const total = activas.length;
    const conteo = activas
      .map((t) => t.dificultad as number)
      .reduce(
        (acc: Record<number, number>, d) => {
          acc[d] = (acc[d] ?? 0) + 1;
          return acc;
        },
        { 1: 0, 2: 0, 3: 0 }
      );
    const porDificultad = {
      [DificultadTarea.Facil]: {
        cantidad: conteo[1],
        porcentaje: total ? `${((conteo[1] / total) * 100).toFixed(2)}%` : "0.00%",
      },
      [DificultadTarea.Medio]: {
        cantidad: conteo[2],
        porcentaje: total ? `${((conteo[2] / total) * 100).toFixed(2)}%` : "0.00%",
      },
      [DificultadTarea.Dificil]: {
        cantidad: conteo[3],
        porcentaje: total ? `${((conteo[3] / total) * 100).toFixed(2)}%` : "0.00%",
      },
    };
    return { total, porDificultad };
  }

 
  public obtenerTareasVencidas(): Tarea[] {
    const ignorar = [EstadoTarea.Terminada, EstadoTarea.Cancelada];
    return this.obtenerTodasActivas().filter((t) => t.isVencida() && !ignorar.includes(t.estado));
  }

  public obtenerTareasPrioridadAlta(): Tarea[] {
    return this.obtenerTodasActivas().filter((t) => t.esPrioridadAlta());
  }
}
