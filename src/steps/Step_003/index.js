import BtnPrimary from "../../components/Btn/BtnPrimary";
import InputText from "../../components/Input/InputText";
import Modal from "../../components/Modal";
import validarRendaMensal from "../../utils/validators/renda.js";

import "./styles.css";
import { useState } from "react";
import BtnSecundary from "../../components/Btn/BtnSecundary";

export default function Step002({
  setStep,

  data,
  setData,
}) {
  const [errors, setErrors] = useState({});
  const [modalCancelAberto, setModalCancelAberto] = useState(false);

  const handleChangeData = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novosErros = {};

    if (data.profissao_atual === "" || data.profissao_atual === null) {
      novosErros.renda_mensal = "Renda mensal inválida";
    }

    if (!validarRendaMensal(data.renda_mensal)) {
      novosErros.renda_mensal = "Renda mensal inválida";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      setModalCancelAberto(true);
      return;
    }

    setErrors({});
    setModalCancelAberto(false);
    setStep(4);
  };

  return (
    <div className="container-step-3">
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
        Falta pouco... Preencha mais alguns dados{" "}
        <strong> sobre sua renda.</strong>
      </p>

      <InputText
        label="Qual profissão você exerce atualmente?"
        placeholder="Insira a sua profissão..."
        name={"profissao_atual"}
        value={data.profissao_atual}
        onChange={(event) => {
          handleChangeData(event);
        }}
      />

      <InputText
        label="Qual sua renda mensal individual declarada (não familiar)?"
        placeholder="Insira a sua renda mensal..."
        name="renda_mensal"
        value={data.renda_mensal}
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
          setStep(2);
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
        ></Modal>
      )}
    </div>
  );
}
