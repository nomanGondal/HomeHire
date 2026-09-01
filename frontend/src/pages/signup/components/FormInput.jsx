const FormInput = ({ label, type = "text", name, value, onChange, placeholder, error }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        sid={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default FormInput;