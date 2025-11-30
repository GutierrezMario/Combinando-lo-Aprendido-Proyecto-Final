export enum EstadoTarea {
  Pendiente = "Pendiente",
  EnCurso = "En curso",
  Terminada = "Terminada",
  Cancelada = "Cancelada",
}

export enum DificultadTarea {
  Facil = 1,
  Medio = 2,
  Dificil = 3,
}


export const EMOJIS_DIFICULTAD: Record<DificultadTarea, string> = {
  [DificultadTarea.Facil]: "★☆☆ / 🌕🌑🌑",
  [DificultadTarea.Medio]: "★★☆ / 🌕🌕🌑",
  [DificultadTarea.Dificil]: "★★★ / 🌕🌕🌕",
};