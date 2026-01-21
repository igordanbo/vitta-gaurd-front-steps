import BtnPrimary from "../../components/Btn/BtnPrimary";
import Modal from "../../components/Modal";

import "./styles.css";
import { useState } from "react";
import BtnSecundary from "../../components/Btn/BtnSecundary";
import SelectCustom from "../../components/SelectCustom";
import moment from "moment";
import Loading from "../../components/Loading";

export default function Step004({
  setStep,
  data,
  setData,
}) {
  const [modalErrorAberto, setModalErrorAberto] = useState(false);
  const [modalCancelAberto, setModalCancelAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeData = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      setModalCancelAberto(true);
      return;
    }

    setModalCancelAberto(false);

    const scriptUrl = "https://script.google.com/macros/s/AKfycbyAn0S21ePJgnxl2_S8CB-vRR759KjIh_CSz2uhkSrtOErJOAaYeovpfgDVReXa9DGyrA/exec";

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    formData.append("criado_em", moment().format("DD/MM/YYYY HH:mm:ss"));

    setLoading(true);

    fetch(scriptUrl, {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        setStep(5);
      } else {
        setModalErrorAberto(true);
        throw new Error("Erro ao enviar o formulário");
      }
    }).catch((error) => {
      console.error("Erro ao enviar o formulário:", error);
      setModalErrorAberto(true);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <>
      {loading && <Loading />}
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
          disabled={loading}
          loading={loading}
        >
          Concluir
        </BtnPrimary>

        <BtnSecundary
          onClick={() => {
            setStep(3);
          }}
          disabled={loading}
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

        {modalErrorAberto && (
          <Modal
            type="warning"
            title="Erro ao enviar o formulário"
            description="Houve um problema ao enviar o formulário. Por favor, tente novamente mais tarde."
            onCancel={() => setModalErrorAberto(false)}
            onConfirm={() => setModalErrorAberto(false)}
          />
        )}
      </div>
    </>
  );
}
