import BtnPrimary from "../../components/Btn/BtnPrimary";

import "./styles.css";

export default function Step005({
  data,
  setData,
}) {

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
