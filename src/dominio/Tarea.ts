import { v4 as uuidv4 } from "uuid";
import { EstadoTarea, DificultadTarea, EMOJIS_DIFICULTAD } from "./enums";

export class Tarea {
  public readonly id: string;
  public titulo: string;
  public descripcion: string;
  public dificultad: DificultadTarea;
  public estado: EstadoTarea;
  public fechaCreacion: Date;
  public fechaVencimiento: Date | null;
  public fechaUltimaEdicion: Date;
  public eliminadaLogica: boolean;
  public fechaEliminacion: Date | null;

  constructor(
    titulo: string,
    descripcion = "",
    vencimiento: Date | null = null,
    dificultad: DificultadTarea = DificultadTarea.Facil
  ) {
    this.id = uuidv4();
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.dificultad = dificultad;
    this.estado = EstadoTarea.Pendiente;
    this.fechaCreacion = new Date();
    this.fechaVencimiento = vencimiento;
    this.fechaUltimaEdicion = this.fechaCreacion;
    this.eliminadaLogica = false;
    this.fechaEliminacion = null;
  }

  
  static reconstruir(data: any): Tarea {
    const tarea = new Tarea(
      data.titulo ?? "",
      data.descripcion ?? "",
      data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
      data.dificultad as DificultadTarea
    );
    
    (tarea as any).id = data.id;
    tarea.estado = data.estado as EstadoTarea;
    tarea.fechaCreacion = new Date(data.fechaCreacion);
    tarea.fechaUltimaEdicion = new Date(data.fechaUltimaEdicion);
    tarea.eliminadaLogica = !!data.eliminadaLogica;
    tarea.fechaEliminacion = data.fechaEliminacion ? new Date(data.fechaEliminacion) : null;
    return tarea;
  }

  
  public actualizar(datos: Partial<Tarea>): void {
    Object.assign(this, datos);
    this.fechaUltimaEdicion = new Date();
  }

  public marcarEliminada(): void {
    this.eliminadaLogica = true;
    this.fechaEliminacion = new Date();
  }

 
  public isVencida(): boolean {
    return this.fechaVencimiento !== null && this.fechaVencimiento < new Date();
  }

  public esPrioridadAlta(): boolean {
    return this.dificultad === DificultadTarea.Dificil;
  }

  public esRelacionada(clave: string): boolean {
    const c = (clave ?? "").toLowerCase();
    return this.titulo.toLowerCase().includes(c) || this.descripcion.toLowerCase().includes(c);
  }

  public toDict(): any {
    return { ...this };
  }

  public toString(): string {
    const simbolo: Record<EstadoTarea, string> = {
      [EstadoTarea.Pendiente]: "[ ]",
      [EstadoTarea.EnCurso]: "[>]",
      [EstadoTarea.Terminada]: "[X]",
      [EstadoTarea.Cancelada]: "[-]",
    };
    const vencimientoStr = this.fechaVencimiento
      ? this.fechaVencimiento.toLocaleDateString("es-AR")
      : "Sin vencimiento";
    const eliminadaStr = this.eliminadaLogica ? " (ELIMINADA)" : "";
    return `[${this.id.substring(0, 4)}] ${
      simbolo[this.estado]
    } ${this.titulo} | Dif: ${EMOJIS_DIFICULTAD[this.dificultad]} | Vence: ${vencimientoStr}${eliminadaStr}`;
  }
}