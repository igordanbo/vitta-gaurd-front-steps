export default function validarCelular(celular) {
  if (!celular) return false;
  /* contando com os parênteses, um espaço e um traço */
  if (celular.length !== 15) return false;

  return true;
}
