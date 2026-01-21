import BtnPrimary from "../../components/Btn/BtnPrimary";

import "./styles.css";

import { useNavigate } from "react-router-dom";

export default function Step005({
  data,
  setData,
}) {

  const navigate = useNavigate();
  const handleChangeData = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(data);
  };

  return (
    <div className="container-step-5">
      <h2>
        Ótimo! Recebemos sua <span className="accent-color">mensagem.</span>
      </h2>

      <p>
        Em breve entraremos em contato <strong> com você.</strong> Agora conheça mais nossos serviços clicando abaixo:
      </p>

      <BtnPrimary
        adicionalClass="success"
        onClick={() => {
          window.location.reload();
        }}
      >
        Voltar a página principal
      </BtnPrimary>
    </div>
  );
}
