import { format, formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: ptBR })
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: ptBR })
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p', { locale: ptBR })
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR
  })
}
