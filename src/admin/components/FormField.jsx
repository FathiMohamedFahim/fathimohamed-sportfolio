import { useId, isValidElement, cloneElement } from 'react'

function FormField({ label, hint, children }) {
  const generatedId = useId()

  const canAssociate = isValidElement(children) && !children.props.id
  const fieldId = canAssociate ? generatedId : children?.props?.id
  const field = canAssociate ? cloneElement(children, { id: fieldId }) : children

  return (
    <div className="admin-form-field">
      <label className="admin-label" htmlFor={fieldId}>
        {label}
      </label>
      {field}
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  )
}

export default FormField
