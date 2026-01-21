import './styles.css'

export default function BtnPrimary({ children, type, onClick, adicionalClass, disabled, loading }) {
    return (
        <button
            className={`btn-primary ${adicionalClass}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}