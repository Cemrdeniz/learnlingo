import { useEffect, useState, useRef } from "react";
import { fetchFilterOptions } from "../../firebase/teacherService";
import styles from "./Filters.module.css";

const CustomSelect = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.selectWrapper} ref={ref}>
      <label>{label}</label>

      <div
        className={styles.selectBox}
        onClick={() => setOpen(!open)}
      >
        {value || "All"}
        <span className={`${styles.arrow} ${open ? styles.rotate : ""}`}>
          ▾
        </span>
      </div>

      {open && (
        <div className={styles.dropdown}>
          <div
            className={styles.option}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            All
          </div>

          {options.map((option) => (
            <div
              key={option}
              className={`${styles.option} ${
                value === option ? styles.active : ""
              }`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Filters({ onFilter }) {
  const [options, setOptions] = useState({
    languages: [],
    levels: [],
    prices: [],
  });

  const [selected, setSelected] = useState({
    language: "",
    level: "",
    price: "",
    favorites: "",
  });

  useEffect(() => {
    const loadFilters = async () => {
      const data = await fetchFilterOptions();
      setOptions(data);
    };
    loadFilters();
  }, []);

  const handleChange = (key, value) => {
    const newSelected = { ...selected, [key]: value };
    setSelected(newSelected);
    onFilter(newSelected);
  };

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        label="Languages"
        options={options.languages}
        value={selected.language}
        onChange={(val) => handleChange("language", val)}
      />

      <CustomSelect
        label="Level of knowledge"
        options={options.levels}
        value={selected.level}
        onChange={(val) => handleChange("level", val)}
      />

      <CustomSelect
        label="Price"
        options={options.prices}
        value={selected.price}
        onChange={(val) => handleChange("price", val)}
      />

      <CustomSelect
        label="Favorites"
        options={["Favorites only"]}
        value={selected.favorites}
        onChange={(val) => handleChange("favorites", val)}
      />
    </div>
  );
}