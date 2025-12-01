import * as readlineSync from "readline-sync";

export function obtenerEntrada<T = string>(
  promptStr: string,
  tipo: "string" | "number" | "date" = "string",
  defaultVal: any = null
): T | null {
  const entrada = readlineSync.question(`${promptStr}: `).trim();
  if (!entrada) return defaultVal;

  switch (tipo) {
    case "number": {
      const num = parseInt(entrada, 10);
      return (isNaN(num) ? defaultVal : num) as T;
    }
    case "date": {
      const date = new Date(entrada);
      return (isNaN(date.getTime()) ? defaultVal : date) as T;
    }
    case "string":
    default:
      return entrada as T;
  }
}
