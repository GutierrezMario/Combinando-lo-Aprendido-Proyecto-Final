import * as fs from "fs";
import { Tarea } from "../dominio/Tarea";

const ARCHIVO = "tareas.json";

export function guardarTareasJson(tareas: Tarea[]): void {
  const datos = JSON.stringify(tareas.map((t) => t.toDict()), null, 2);
  fs.writeFileSync(ARCHIVO, datos, { encoding: "utf-8" });
}

export function cargarTareasJson(): any[] {
  if (!fs.existsSync(ARCHIVO)) return [];
  try {
    const raw = fs.readFileSync(ARCHIVO, "utf-8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}
