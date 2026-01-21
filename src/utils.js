const formatPeso = (peso) => {
    const apenasNumeros = peso.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numero = parseInt(apenasNumeros, 10) / 100;

    return numero.toFixed(2).replace('.', ',');
}

const formatAltura = (altura) => {
    const apenasNumeros = altura.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numero = parseInt(apenasNumeros, 10) / 100;

    return numero.toFixed(2).replace('.', ',');
}

const formatDinheiro = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numero = parseInt(apenasNumeros, 10) / 100;

    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export { formatPeso, formatAltura, formatDinheiro };