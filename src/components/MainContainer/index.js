import "./styles.css";

export default function MainContainer({ children, menuIsOpen }) {
  return (
    <>
      <div className="header-container">
        <div className="header-logo">
          <img src="/imagens/logo-preto.png" alt="Logo" />
        </div>
      </div>
      <div className="main-container">{children}</div>
    </>
  );
}
