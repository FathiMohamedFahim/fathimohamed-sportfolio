function FormField({ label, hint, children }) {
  return (
    <div className="admin-form-field">
      <label className="admin-label">{label}</label>
      {children}
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  )
}

export default FormField
