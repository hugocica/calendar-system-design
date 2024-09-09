import { add, format, sub } from "date-fns";
import { ptBR } from "date-fns/locale";

const DATE_FORMAT = "yyyy-MM-dd";

export function formatDate(date: Date, formatString: string = DATE_FORMAT) {
  return format(date, formatString, { locale: ptBR });
}

export function addDays(date: Date, days: number) {
  return add(date, { days });
}

export function subtractDays(date: Date, days: number) {
  return sub(date, { days });
}
