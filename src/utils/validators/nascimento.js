export default function validarDataNascimento(data) {
  if (!data) return false;

  // Espera formato DD/MM/AAAA
  const partes = data.split("/");
  if (partes.length !== 3) return false;

  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const ano = parseInt(partes[2], 10);

  if (isNaN(dia) || isNaN(mes) || isNaN(ano) || ano < 1900) {
    return false;
  }

  // 0–11
  const dataObj = new Date(ano, mes - 1, dia);

  // Verifica se a data existe
  if (
    dataObj.getFullYear() !== ano ||
    dataObj.getMonth() !== mes - 1 ||
    dataObj.getDate() !== dia
  ) {
    return false;
  }

  // Não pode ser futura
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (dataObj > hoje) return false;

  // Idade mínima (18 anos)
  let idade = hoje.getFullYear() - ano;
  const m = hoje.getMonth() - (mes - 1);

  if (m < 0 || (m === 0 && hoje.getDate() < dia)) {
    idade--;
  }

  if (idade < 18) return false;

  return true;
}
