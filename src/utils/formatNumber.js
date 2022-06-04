import { replace } from 'lodash'
import numeral from 'numeral'

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00')
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%')
}

export function fNumber(number) {
  return numeral(number).format()
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '')
}

export function fData(number) {
  return numeral(number).format('0.0 b')
}

export function fCNPJ(number) {
  return String(number).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}