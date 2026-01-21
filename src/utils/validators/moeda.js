export default function normalizarMoeda(valor) {
  if (!valor) return null;

  const limpo = valor
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numero = parseFloat(limpo);
  return isNaN(numero) ? null : numero;
}
