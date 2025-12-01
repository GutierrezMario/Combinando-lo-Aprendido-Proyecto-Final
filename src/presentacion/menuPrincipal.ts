import { RepositorioTareas } from "../dominio/RepositorioTareas";
import { Tarea } from "../dominio/Tarea";
import { DificultadTarea } from "../dominio/enums";
import { obtenerEntrada } from "../infraestructura/entrada";
import { menuListado } from "./menuListado";
import { menuEstadisticas } from "./menuEstadisticas";

export function menuPrincipal(): void {
  const repo = new RepositorioTareas();

  
  if (repo.obtenerTodasActivas().length === 0) {
    console.log("💡 Inicializando con datos de ejemplo...");
    repo.agregar(
      new Tarea("Preparar fundamentación", "Explicar PF/POO aplicada", new Date(), DificultadTarea.Dificil)
    );
    repo.agregar(new Tarea("Revisar código", "Aplicar buenas prácticas", null, DificultadTarea.Medio));
    repo.agregar(
      new Tarea(
        "Entrega final",
        "Subir proyecto completo",
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        DificultadTarea.Facil
      )
    );
  }

  let seguir = true;
  while (seguir) {
    console.log("\n==================================");
    console.log("=== TO-DO LIST (Trabajo Final) ===");
    console.log("1. Listar todas las tareas");
    console.log("2. Buscar tareas por título");
    console.log("3. Ver estadísticas");
    console.log("4. Agregar nueva tarea");
    console.log("5. Buscar tareas relacionadas");
    console.log("0. Salir");
    console.log("==================================");

    const opcion = obtenerEntrada<string>("Seleccione una opción", "string", "0");

    if (opcion === "1") {
      const todas = repo.obtenerTodasActivas();
      menuListado(repo, "Listado de Tareas Activas", todas);
    } else if (opcion === "2") {
      const clave = obtenerEntrada<string>("Ingrese palabra clave", "string", "") ?? "";
      const resultados = repo.buscarPorTitulo(clave);
      menuListado(repo, `Resultados de búsqueda: '${clave}'`, resultados);
    } else if (opcion === "3") {
      menuEstadisticas(repo);
    } else if (opcion === "4") {
      const titulo = obtenerEntrada<string>("Título", "string", "Sin título") ?? "Sin título";
      const descripcion = obtenerEntrada<string>("Descripción", "string", "") ?? "";
      const dificultadNum = obtenerEntrada<number>("Dificultad (1-Fácil, 2-Medio, 3-Difícil)", "number", 1) ?? 1;
      const dificultad =
        dificultadNum === 3
          ? DificultadTarea.Dificil
          : dificultadNum === 2
          ? DificultadTarea.Medio
          : DificultadTarea.Facil;
      const fechaVencimiento = obtenerEntrada<Date>("Fecha de vencimiento (YYYY-MM-DD)", "date", null);
      const nueva = new Tarea(titulo, descripcion, fechaVencimiento, dificultad);
      repo.agregar(nueva);
      console.log(" Tarea agregada correctamente.");
    } else if (opcion === "5") {
      const clave = obtenerEntrada<string>("Palabra clave relacionada", "string", "") ?? "";
      const relacionadas = repo.obtenerTareasRelacionadas(clave);
      menuListado(repo, `Tareas relacionadas con '${clave}'`, relacionadas);
    } else if (opcion === "0") {
      console.log("\n ¡Gracias por usar la aplicación! ");
      seguir = false;
    } else {
      console.log(" Opción no válida. Intente nuevamente.");
    }
  }
}
