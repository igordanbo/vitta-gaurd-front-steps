import BtnPrimary from "../../components/Btn/BtnPrimary";
import InputText from "../../components/Input/InputText";
import InputCustomMask from "../../components/Input/InputCustomMask";
import Modal from "../../components/Modal";
import validarCelular from "../../utils/validators/celular.js";

import "./styles.css";
import { useState } from "react";
import BtnSecundary from "../../components/Btn/BtnSecundary/index.js";

export default function Step001({ setStep, data, setData }) {
  const [errors, setErrors] = useState({});
  const [modalCancelAberto, setModalCancelAberto] = useState(false);

  const handleChangeData = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "celular") {
      setErrors((prev) => ({
        ...prev,
        celular: validarCelular(value)
          ? null
          : "Celular inválido. Use DDD + 9 dígitos",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novosErros = {};

    const nome = data.nome?.trim() || "";
    const celular = data.celular || "";

    if (!nome) {
      novosErros.nome = "Nome obrigatório";
      console.error("Nome obrigatório");
    }

    if (!validarCelular(celular)) {
      novosErros.celular = "Celular inválido";
      console.error("Celular inválido");
    }

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      setModalCancelAberto(true);
      return;
    }

    setErrors({});
    setModalCancelAberto(false);
    setStep(2);
  };

  return (
    <div className="container-step-1">
      <div className="loader-steps">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <h2>
        Seguro inteligente para o que realmente{" "}
        <span className="accent-color">importa.</span>
      </h2>

      <p>
        Contrate agora em menos de 5 minutos o seu seguro com a Vitta Guard.{" "}
        <strong>Você mais seguro, agora.</strong>
      </p>

      <h3>Preencha seus dados</h3>

      <InputText
        label={"Preencha seu nome"}
        placeholder={"Preencha seu nome"}
        name={"nome"}
        value={data.nome}
        onChange={(event) => {
          handleChangeData(event);
        }}
      />
      <InputCustomMask
        label="Preencha seu celular"
        placeholder="(99) 99999-9999"
        name="celular"
        value={data.celular}
        onChange={handleChangeData}
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
          setModalCancelAberto(false);
          window.location.href = "/";
        }}
      >
        Voltar para a página inicial
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
