import BtnPrimary from "../../components/Btn/BtnPrimary";
import InputText from "../../components/Input/InputText";
import InputCustomMask from "../../components/Input/InputCustomMask";
import Modal from "../../components/Modal";
import validarDataNascimento from "../../utils/validators/nascimento.js";
import validarAltura from "../../utils/validators/altura.js";
import validarPeso from "../../utils/validators/peso.js";

import "./styles.css";
import { useState } from "react";
import BtnSecundary from "../../components/Btn/BtnSecundary";
import { formatAltura, formatPeso } from "../../utils.js";

export default function Step002({ setStep, data, setData }) {
  const [modalCancelAberto, setModalCancelAberto] = useState(false);

  const handleChangeData = (event) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "peso") {
      const apenasNumeros = value.replace(/\D/g, '');
      formattedValue = apenasNumeros ? formatPeso(apenasNumeros) : '';
    } else if (name === "altura") {
      const apenasNumeros = value.replace(/\D/g, '');
      formattedValue = apenasNumeros ? formatAltura(apenasNumeros) : '';
    }

    setData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novosErros = {};

    if (!validarDataNascimento(data.data_nascimento)) {
      novosErros.data_nascimento = "Data de nascimento inválida";
    }

    if (!validarPeso(data.peso)) {
      novosErros.peso = "Peso inválido (ex: 79,5)";
    }

    if (!validarAltura(data.altura)) {
      novosErros.altura = "Altura inválida (ex: 1,65)";
    }

    if (Object.keys(novosErros).length > 0) {
      setModalCancelAberto(true);
      return;
    }

    setModalCancelAberto(false);
    setStep(3);
  };

  return (
    <div className="container-step-2">
      <div className="loader-steps">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <h2>
        Sobre <span className="accent-color">você.</span>
      </h2>

      <p>
        Quase lá... Preencha mais alguns dados <strong> sobre você.</strong>
      </p>

      <InputCustomMask
        label="Sua data de nascimento"
        placeholder="99/99/9999"
        mask="99/99/9999"
        name="data_nascimento"
        value={data.data_nascimento}
        onChange={handleChangeData}
      />

      <InputText
        label={"Preencha seu peso"}
        placeholder={"79,00"}
        name={"peso"}
        value={data.peso}
        onChange={(event) => {
          handleChangeData(event);
        }}
      />

      <InputText
        label={"Preencha sua altura"}
        placeholder={"1,65"}
        name={"altura"}
        value={data.altura}
        onChange={(event) => {
          handleChangeData(event);
        }}
      />

      <BtnPrimary
        adicionalClass="success"
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        Próximo passo
      </BtnPrimary>

      <BtnSecundary
        onClick={() => {
          setStep(1);
        }}
      >
        Voltar um passo
      </BtnSecundary>

      {modalCancelAberto && (
        <Modal
          type="warning"
          title="Digite corretamente os dados"
          description="Confira novamente se todos os campos foram preenchidos corretamente para seguir com sua cotação."
          onCancel={() => setModalCancelAberto(false)}
          onConfirm={() => setModalCancelAberto(false)}
        />
      )}
    </div>
  );
}
