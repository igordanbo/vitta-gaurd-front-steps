import normalizarNumero from "./numero";

export default function validarAltura(altura) {
  const valor = normalizarNumero(altura);
  return valor !== null && valor >= 0.5 && valor <= 2.5;
}
