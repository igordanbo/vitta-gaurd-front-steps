import normalizarNumero from "./numero";

export default function validarPeso(peso) {
  const valor = normalizarNumero(peso);
  return valor !== null && valor >= 20 && valor <= 400;
}
