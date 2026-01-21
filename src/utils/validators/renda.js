import normalizarMoeda from "./moeda";

export default function validarRendaMensal(renda) {
  const valor = normalizarMoeda(renda);

  if (valor === null) return false;
  if (valor <= 0) return false;
  if (valor > 1000000) return false;

  return true;
}
