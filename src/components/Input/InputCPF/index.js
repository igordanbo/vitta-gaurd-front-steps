import { useState } from "react";
import InputMask from "react-input-mask";
import "./styles.css";

export default function InputCPF({
  label,
  mask,
  type,
  name,
  value,
  onChange,
  placeholder,
  setCpfValido,
  cpfValido
}) {
  const [mensagemErro, setMensagemErro] = useState(null);

  const handleChange = (evento) => {
    const cpf = evento.target.value;
    const valido = validarCPF(cpf);
    setCpfValido(valido);

    if (!valido && cpf.replace(/\D/g, '').length === 11) {
      setMensagemErro("CPF inválido");
    } else {
      setMensagemErro(null);
    }

    onChange(evento);
  };



  return (
    <div className="custom-input-mask">
      <label>{label}</label>
      <InputMask
        className="input-mask"
        mask={mask || "(99) 99999-9999"}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={(evento) => handleChange(evento)}
      >
        {(inputProps) => <input type={type} {...inputProps} />}
      </InputMask>
      {mensagemErro && <span className="error-message">{mensagemErro}</span>}
    </div>
  );
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}
