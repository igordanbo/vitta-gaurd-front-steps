import "./styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Step001 from "../../steps/Step_001";
import Step002 from "../../steps/Step_002";
import Step003 from "../../steps/Step_003";
import Step004 from "../../steps/Step_004";
import Step005 from "../../steps/Step_005";
import Loading from "../../components/Loading";

export default function Form({ nameInput, valueInput }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    nome: "",
    celular: "",
    data_nascimento: "",
    altura: "",
    peso: "",
    profissao_atual: "",
    renda_mensal: "",
    sexo: "",
    fumante: "",
  });

  const steps = {
    1: (
      <>
        {loading && <Loading />}
        <Step001 step={step} setStep={setStep} data={data} setData={setData} />
      </>
    ),
    2: (
      <>
        {loading && <Loading />}
        <Step002 data={data} setData={setData} step={step} setStep={setStep} />
      </>
    ),
    3: (
      <>
        {loading && <Loading />}
        <Step003 data={data} setData={setData} step={step} setStep={setStep} />
      </>
    ),
    4: (
      <>
        {loading && <Loading />}
        <Step004 data={data} setData={setData} step={step} setStep={setStep} />
      </>
    ),
    5: (
      <>
        {loading && <Loading />}
        <Step005 data={data} setData={setData} step={step} setStep={setStep} />
      </>
    ),

  };

  return (
    <div className="step-container">
      {steps[step] || <p>Etapa não encontrada</p>}
    </div>
  );
}
