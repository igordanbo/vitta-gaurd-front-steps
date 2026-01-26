import { useState, useMemo, useRef, useEffect } from "react";
import "./style.css";

export default function SelectSearchCustom({
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder = "Selecione...",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.labelKey.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, options]);

  function handleSelect(option) {
    onChange({
      target: {
        name: "profissao_atual",
        value: option.valueKey, // ID
      },
    });

    onChange({
      target: {
        name: "profissao_atual_nome",
        value: option.labelKey, // Nome
      },
    });

    setOpen(false);
  }

  const selectedLabel = options.find((opt) => opt.valueKey === value)?.labelKey;

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="select-search" ref={containerRef}>
      {label && <label>{label}</label>}

      <div className="select-box" onClick={() => setOpen((prev) => !prev)}>
        <span>{selectedLabel || placeholder}</span>
      </div>

      {open && (
        <div className="select-dropdown">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          <ul>
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <li key={option.valueKey} onClick={() => handleSelect(option)}>
                  {option.labelKey}
                </li>
              ))
            ) : (
              <li className="empty">Nenhum resultado</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
