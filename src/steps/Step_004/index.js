import BtnPrimary from "../../components/Btn/BtnPrimary";
import Modal from "../../components/Modal";

import "./styles.css";
import { useEffect, useState } from "react";
import BtnSecundary from "../../components/Btn/BtnSecundary";
import SelectCustom from "../../components/SelectCustom";

export default function Step004({
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

    if (data.sexo === "" || data.sexo === null) {
      novosErros.sexo = "Informação não preenchida (Sexo)";
    }

    if (data.fumante === "" || data.fumante === null) {
      novosErros.fumante = "Informação não preenchida (Fumante)";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      setModalCancelAberto(true);
      return;
    }

    setErrors({});
    setModalCancelAberto(false);
    setStep(5);
  };

  return (
    <div className="container-step-4">
      <div className="loader-steps">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <h2>
        Ultimo <span className="accent-color">passo.</span>
      </h2>

      <p>
        Terminando... Preencha esses últimos dados <strong> sobre você.</strong>
      </p>

      <SelectCustom
        label={"No seu registro de nascimento consta o sexo:"}
        valueKey="valuekey"
        labelKey="labelKey"
        name={"sexo"}
        options={[
          { valueKey: "masculino", labelKey: "Masculino" },
          { valueKey: "masculino", labelKey: "Feminino" },
        ]}
        value={data.sexo}
        onChange={(event) => {
          handleChangeData(event);
        }}
      />

      <SelectCustom
        label={
          "Você fumou produtos com nicotina ou cigarros eletrônicos nos últimos 24 meses:"
        }
        valueKey="valuekey"
        labelKey="labelKey"
        name={"fumante"}
        options={[
          { valueKey: true, labelKey: "Sim" },
          { valueKey: false, labelKey: "Não" },
        ]}
        value={data.fumante}
        onChange={(event) => {
          handleChangeData(event);
        }}
      />

      <BtnPrimary
        adicionalClass="success_btn"
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        Concluir
      </BtnPrimary>

      <BtnSecundary
        onClick={() => {
          setStep(3);
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
