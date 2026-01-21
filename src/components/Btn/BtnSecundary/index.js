import './styles.css'

export default function BtnSecundary ( { children, type, onClick, adicionalClass, disabled } ) {
    return (
        <button
            className={`btn-secundary ${adicionalClass}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}