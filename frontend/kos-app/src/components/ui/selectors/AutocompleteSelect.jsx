import React, { useState, useRef, useEffect } from "react";
import styles from "./AutocompleteSelect.module.css";

export default function AutocompleteSelect({ 
  items, 
  selectedItem, 
  setSelectedItem, 
  disabled,
  placeholder = "Digite para buscar...",
  labelKey = "name",
  valueKey = "id", 
  onSelect
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const containerRef = useRef(null);

  // Atualizar filteredItems quando items muda
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);

    // Filtrar items baseado no input
    if (value.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        String(item[labelKey]).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(String(item[valueKey]));
    setInputValue(String(item[labelKey]));
    setIsOpen(false);
    if (onSelect) onSelect(item);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputValue.trim() === "") {
      setFilteredItems(items);
    }
  };

  // Encontrar o label do item selecionado
  const selectedItemLabel = items.find(
    (item) => String(item[valueKey]) === String(selectedItem)
  )?.[labelKey] || "";

  // Se houver um item selecionado mas inputValue está vazio, preenchê-lo
  useEffect(() => {
    if (selectedItem && !inputValue) {
      setInputValue(selectedItemLabel);
    }
  }, [selectedItem, selectedItemLabel, inputValue]);

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
        autoComplete="off"
      />

      {isOpen && filteredItems.length > 0 && (
        <div className={styles.dropdown}>
          {filteredItems.map((item) => (
            <div
              key={item[valueKey]}
              className={`${styles.option} ${
                String(item[valueKey]) === String(selectedItem) ? styles.selected : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item[labelKey]}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredItems.length === 0 && inputValue.trim() !== "" && (
        <div className={styles.noResults}>
          Nenhum resultado encontrado
        </div>
      )}
    </div>
  );
}