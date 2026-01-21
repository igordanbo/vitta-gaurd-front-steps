export default function normalizarNumero(valor) {
  if (!valor) return null;
  return parseFloat(valor.replace(",", "."));
}
