import BtnPrimary from "../../components/Btn/BtnPrimary";
import Modal from "../../components/Modal";

import "./styles.css";
import { useEffect, useState } from "react";
import BtnSecundary from "../../components/Btn/BtnSecundary";
import SelectCustom from "../../components/SelectCustom";
import moment from "moment";
import Loading from "../../components/Loading";
import InputText from "../../components/Input/InputText";
import InputCustomMask from "../../components/Input/InputCustomMask";
import validarCelular from "../../utils/validators/celular.js";
import validarDataNascimento from "../../utils/validators/nascimento.js";
import validarAltura from "../../utils/validators/altura.js";
import validarPeso from "../../utils/validators/peso.js";
import validarRendaMensal from "../../utils/validators/renda.js";
import SelectSearchCustom from "../../components/SelectSearchCustom/index.js";
import { useNavigate } from "react-router-dom";
import { formatAltura, formatDinheiro, formatPeso } from "../../utils.js";
import axios from "axios";
import { URLapi } from "../../Constants.js";

export default function Step004({ setStep, data, setData }) {
  const [modalErrorAberto, setModalErrorAberto] = useState(false);
  const [modalCancelAberto, setModalCancelAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profissoes, setProfissoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfissoes() {
      try {
        const response = await fetch(
          "https://api.gateway.azos.com.br/v1/platform/quotation/professions",
          {
            headers: {
              "X-API-KEY": `t7JLQdwJYOzydr6PSe0PJAWGXUKFJtcxKbDMd8e04x7vMZGU`,
              "Content-Type": "application/json",
            },
          },
        );
        const result = await response.json();

        // transforma para o formato do SelectCustom
        const options = result.map((item) => ({
          valueKey: item._id,
          labelKey: item.name,
        }));

        setProfissoes(options);
      } catch (error) {
        console.error("Erro ao buscar profissões", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfissoes();
  }, []);

  const handleChangeData = (event) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "peso") {
      const apenasNumeros = value.replace(/\D/g, '');
      formattedValue = apenasNumeros ? formatPeso(apenasNumeros) : '';
    } else if (name === "altura") {
      const apenasNumeros = value.replace(/\D/g, '');
      formattedValue = apenasNumeros ? formatAltura(apenasNumeros) : '';
    } else if (name === "renda_mensal") {
      const apenasNumeros = value.replace(/\D/g, '');
      formattedValue = apenasNumeros ? formatDinheiro(apenasNumeros) : '';
    }

    setData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
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

    if (!validarDataNascimento(data.data_nascimento)) {
      novosErros.data_nascimento = "Data de nascimento inválida";
    }

    if (!validarPeso(data.peso)) {
      novosErros.peso = "Peso inválido (ex: 79,5)";
    }

    if (!validarAltura(data.altura)) {
      novosErros.altura = "Altura inválida (ex: 1,65)";
    }

    if (data.profissao_atual === "" || data.profissao_atual === null) {
      novosErros.profissao_atual = "Profissão atual inválida";
    }

    if (data.profissao_atual === "6154a70ed46bee50b01c610c") {
      if (data.outra_profissao === "" || data.outra_profissao === null) {
        novosErros.profissao_atual = "Preencha sua profissão manualmente";
      }
    }

    if (
      data.profissao_atual === "6154a712d46bee50b01c61bc" ||
      data.profissao_atual === "6154a711d46bee50b01c6145" ||
      data.profissao_atual === "6154a711d46bee50b01c615a"
    ) {
      if (data.plano_escolhido === "" || data.plano_escolhido === null) {
        novosErros.plano_escolhido = "Selecione o plano escolhido";
      }
    }

    if (!validarRendaMensal(data.renda_mensal)) {
      novosErros.renda_mensal = "Renda mensal inválida";
    }

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

    try {
      setLoading(true);

      await Promise.all([
        sendToAzos(),
        sendToGSheets()
      ])

      setStep(5);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setModalErrorAberto(true);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  const sendToAzos = async () => {
    const dataFormatted = (value) => {
      let valueFormatted = value;

      valueFormatted = valueFormatted ? valueFormatted.replace('.', '') : null;
      valueFormatted = valueFormatted ? valueFormatted.replace(',', '.') : null;
      valueFormatted = valueFormatted ? valueFormatted.replace('R$', '') : null;
      valueFormatted = valueFormatted ? parseFloat(valueFormatted) : null;

      return valueFormatted;
    }

    const cleanPhone = (phone) => {
      return phone.replace(/\D/g, '');
    }

    const dataToSend = {
      params: {
        professionId: data?.profissao_atual,
        alternativeProfession: data?.outra_profissao || "",
        isSmoker: data?.fumante,
        gender: data?.sexo,
        salary: null,
        monthlyIncome: dataFormatted(data?.renda_mensal).toFixed(2),
        weight: dataFormatted(data?.peso),
        height: dataFormatted(data?.altura),
        birthDate: data?.data_nascimento || "",
        fullName: data?.nome || "",
        professionDescription: data?.profissao_atual_nome,
        socialName: null,
        phone: cleanPhone(data?.celular || ""),
      },
      isSpecialist: true
    }

    await axios.post(`${URLapi}/azos/quotations`, dataToSend);
  }

  const sendToGSheets = async () => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyAn0S21ePJgnxl2_S8CB-vRR759KjIh_CSz2uhkSrtOErJOAaYeovpfgDVReXa9DGyrA/exec';

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const profissaoSelecionada = profissoes.find(
      (p) => p.valueKey === data.profissao_atual,
    );

    const profissaoAtualNome =
      data.profissao_atual === "6154a70ed46bee50b01c610c"
        ? data.outra_profissao
        : profissaoSelecionada?.labelKey || "";

    formData.append("profissao_atual_nome", profissaoAtualNome);
    formData.append('criado_em', moment().format('DD/MM/YYYY HH:mm:ss'));

    await axios.post(scriptUrl, formData);
  }

  return (
    <>
      {loading && <Loading />}
      <div className="container-step-4">
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

        <SelectSearchCustom
          label="Qual é a sua profissão?"
          name="profissao_atual"
          options={profissoes}
          value={data.profissao_atual}
          onChange={handleChangeData}
        />

        {data?.profissao_atual === "6154a70ed46bee50b01c610c" ? (
          <InputText
            label="Insira o nome da sua profissão"
            placeholder="Insira o nome da sua profissão..."
            name="outra_profissao"
            value={data.outra_profissao}
            onChange={handleChangeData}
          />
        ) : (
          ""
        )}

        {data?.profissao_atual === "6154a712d46bee50b01c61bc" ||
          data?.profissao_atual === "6154a711d46bee50b01c6145" ||
          data?.profissao_atual === "6154a711d46bee50b01c615a" ? (
          <>
            <div className="planos_saude">
              <h3>
                Selecione o <span>plano</span> que deseja em sua{" "}
                <span>cobertura</span>.
              </h3>

              <div className="plano1">
                <h3>
                  Plano <span>Silver</span>
                </h3>
                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                    <p>Seguro de vida</p>
                  </span>
                  <div>
                    <p>R$500.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-leaf"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811" />
                    </svg>
                    <p>Assistência funeral familiar</p>
                  </span>

                  <div>
                    <p>Até R$15.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-capsule"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                    </svg>
                    <p>
                      Renda por Incapacidade Temporária (com pagamento
                      retroativo)
                    </p>
                  </span>

                  <div>
                    <p>R$250,00/dia</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-person-wheelchair"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.663 2.146a1.5 1.5 0 0 0-.47-2.115l-2.5-1.508a1.5 1.5 0 0 0-1.676.086l-2.329 1.75a.866.866 0 0 0 1.051 1.375L7.361 3.37l.922.71-2.038 2.445A4.73 4.73 0 0 0 2.628 7.67l1.064 1.065a3.25 3.25 0 0 1 4.574 4.574l1.064 1.063a4.73 4.73 0 0 0 1.09-3.998l1.043-.292-.187 2.991a.872.872 0 1 0 1.741.098l.206-4.121A1 1 0 0 0 12.224 8h-2.79zM3.023 9.48a3.25 3.25 0 0 0 4.496 4.496l1.077 1.077a4.75 4.75 0 0 1-6.65-6.65z" />
                    </svg>
                    <p>Invalidex Permanente Total</p>
                  </span>

                  <div>
                    <p>R$500.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-virus2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a1 1 0 0 0-1 1v1.143c0 .557-.407 1.025-.921 1.24-.514.214-1.12.162-1.513-.231l-.809-.809a1 1 0 1 0-1.414 1.414l.809.809c.394.394.445.999.23 1.513C3.169 6.593 2.7 7 2.144 7H1a1 1 0 0 0 0 2h1.143c.557 0 1.025.407 1.24.921.214.514.163 1.12-.231 1.513l-.809.809a1 1 0 0 0 1.414 1.414l.809-.809c.394-.394.999-.445 1.513-.23.514.214.921.682.921 1.24V15a1 1 0 1 0 2 0v-1.143c0-.557.407-1.025.921-1.24.514-.214 1.12-.162 1.513.231l.809.809a1 1 0 0 0 1.414-1.414l-.809-.809c-.393-.394-.445-.999-.23-1.513.214-.514.682-.921 1.24-.921H15a1 1 0 1 0 0-2h-1.143c-.557 0-1.025-.407-1.24-.921-.214-.514-.162-1.12.231-1.513l.809-.809a1 1 0 0 0-1.414-1.414l-.809.809c-.394.393-.999.445-1.513.23-.514-.214-.92-.682-.92-1.24V1a1 1 0 0 0-1-1Zm2 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0m1 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    <p>Doenças Graves 30</p>
                  </span>

                  <div>
                    <p>Até R$100.000,00</p>
                  </div>
                </div>
              </div>

              <div className="plano2">
                <h3>
                  Plano <span>Gold</span>
                </h3>
                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                    <p>Seguro de vida</p>
                  </span>
                  <div>
                    <p>R$800.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-leaf"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811" />
                    </svg>
                    <p>Assistência funeral familiar</p>
                  </span>

                  <div>
                    <p>Até R$15.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-capsule"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                    </svg>
                    <p>
                      Renda por Incapacidade Temporária (com pagamento
                      retroativo)
                    </p>
                  </span>

                  <div>
                    <p>R$400,00/dia</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-person-wheelchair"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.663 2.146a1.5 1.5 0 0 0-.47-2.115l-2.5-1.508a1.5 1.5 0 0 0-1.676.086l-2.329 1.75a.866.866 0 0 0 1.051 1.375L7.361 3.37l.922.71-2.038 2.445A4.73 4.73 0 0 0 2.628 7.67l1.064 1.065a3.25 3.25 0 0 1 4.574 4.574l1.064 1.063a4.73 4.73 0 0 0 1.09-3.998l1.043-.292-.187 2.991a.872.872 0 1 0 1.741.098l.206-4.121A1 1 0 0 0 12.224 8h-2.79zM3.023 9.48a3.25 3.25 0 0 0 4.496 4.496l1.077 1.077a4.75 4.75 0 0 1-6.65-6.65z" />
                    </svg>
                    <p>Invalidex Permanente Total</p>
                  </span>

                  <div>
                    <p>R$1.000.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-virus2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a1 1 0 0 0-1 1v1.143c0 .557-.407 1.025-.921 1.24-.514.214-1.12.162-1.513-.231l-.809-.809a1 1 0 1 0-1.414 1.414l.809.809c.394.394.445.999.23 1.513C3.169 6.593 2.7 7 2.144 7H1a1 1 0 0 0 0 2h1.143c.557 0 1.025.407 1.24.921.214.514.163 1.12-.231 1.513l-.809.809a1 1 0 0 0 1.414 1.414l.809-.809c.394-.394.999-.445 1.513-.23.514.214.921.682.921 1.24V15a1 1 0 1 0 2 0v-1.143c0-.557.407-1.025.921-1.24.514-.214 1.12-.162 1.513.231l.809.809a1 1 0 0 0 1.414-1.414l-.809-.809c-.393-.394-.445-.999-.23-1.513.214-.514.682-.921 1.24-.921H15a1 1 0 1 0 0-2h-1.143c-.557 0-1.025-.407-1.24-.921-.214-.514-.162-1.12.231-1.513l.809-.809a1 1 0 0 0-1.414-1.414l-.809.809c-.394.393-.999.445-1.513.23-.514-.214-.92-.682-.92-1.24V1a1 1 0 0 0-1-1Zm2 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0m1 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    <p>Doenças Graves 30</p>
                  </span>

                  <div>
                    <p>Até R$150.000,00</p>
                  </div>
                </div>
              </div>

              <div className="plano3 borda-gradiente">
                <h3>
                  <span className="texto-gradiente">Plano Prêmium</span>
                </h3>
                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                    <p>Seguro de vida</p>
                  </span>
                  <div>
                    <p>R$800.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-leaf"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811" />
                    </svg>
                    <p>Assistência funeral familiar</p>
                  </span>

                  <div>
                    <p>Até R$15.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-capsule"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                    </svg>
                    <p>
                      Renda por Incapacidade Temporária (com pagamento
                      retroativo)
                    </p>
                  </span>

                  <div>
                    <p>R$400,00/dia</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-person-wheelchair"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.663 2.146a1.5 1.5 0 0 0-.47-2.115l-2.5-1.508a1.5 1.5 0 0 0-1.676.086l-2.329 1.75a.866.866 0 0 0 1.051 1.375L7.361 3.37l.922.71-2.038 2.445A4.73 4.73 0 0 0 2.628 7.67l1.064 1.065a3.25 3.25 0 0 1 4.574 4.574l1.064 1.063a4.73 4.73 0 0 0 1.09-3.998l1.043-.292-.187 2.991a.872.872 0 1 0 1.741.098l.206-4.121A1 1 0 0 0 12.224 8h-2.79zM3.023 9.48a3.25 3.25 0 0 0 4.496 4.496l1.077 1.077a4.75 4.75 0 0 1-6.65-6.65z" />
                    </svg>
                    <p>Invalidex Permanente Total</p>
                  </span>

                  <div>
                    <p>R$1.000.000,00</p>
                  </div>
                </div>

                <div className="item_plano">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-virus2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a1 1 0 0 0-1 1v1.143c0 .557-.407 1.025-.921 1.24-.514.214-1.12.162-1.513-.231l-.809-.809a1 1 0 1 0-1.414 1.414l.809.809c.394.394.445.999.23 1.513C3.169 6.593 2.7 7 2.144 7H1a1 1 0 0 0 0 2h1.143c.557 0 1.025.407 1.24.921.214.514.163 1.12-.231 1.513l-.809.809a1 1 0 0 0 1.414 1.414l.809-.809c.394-.394.999-.445 1.513-.23.514.214.921.682.921 1.24V15a1 1 0 1 0 2 0v-1.143c0-.557.407-1.025.921-1.24.514-.214 1.12-.162 1.513.231l.809.809a1 1 0 0 0 1.414-1.414l-.809-.809c-.393-.394-.445-.999-.23-1.513.214-.514.682-.921 1.24-.921H15a1 1 0 1 0 0-2h-1.143c-.557 0-1.025-.407-1.24-.921-.214-.514-.162-1.12.231-1.513l.809-.809a1 1 0 0 0-1.414-1.414l-.809.809c-.394.393-.999.445-1.513.23-.514-.214-.92-.682-.92-1.24V1a1 1 0 0 0-1-1Zm2 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0m1 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    <p>Doenças Graves 30</p>
                  </span>

                  <div>
                    <p>Até R$150.000,00</p>
                  </div>
                </div>
              </div>
            </div>

            <SelectCustom
              label={"Selecione o plano escolhido para sua cobertura:"}
              valueKey="valueKey"
              labelKey="labelKey"
              name={"plano_escolhido"}
              options={[
                { valueKey: "silver", labelKey: "Plano Silver" },
                { valueKey: "gold", labelKey: "Plano Gold" },
                { valueKey: "premium", labelKey: "Plano Prêmium" },
              ]}
              value={data.plano_escolhido}
              onChange={(event) => {
                handleChangeData(event);
              }}
            />
          </>
        ) : (
          ""
        )}

        <InputText
          label="Qual sua renda mensal individual declarada (não familiar)?"
          placeholder="Insira a sua renda mensal..."
          name="renda_mensal"
          value={data.renda_mensal}
          onChange={handleChangeData}
        />

        <SelectCustom
          label={"No seu registro de nascimento consta o sexo:"}
          valueKey="valueKey"
          labelKey="labelKey"
          name={"sexo"}
          options={[
            { valueKey: "male", labelKey: "Masculino" },
            { valueKey: "female", labelKey: "Feminino" },
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
          valueKey="valueKey"
          labelKey="labelKey"
          name={"fumante"}
          options={[
            { valueKey: "true", labelKey: "Sim" },
            { valueKey: "false", labelKey: "Não" },
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
            navigate("/");
          }}
          disabled={loading}
        >
          Voltar para a página principal
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
