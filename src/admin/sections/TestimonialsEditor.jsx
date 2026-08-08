import { useState, useEffect } from 'react'
import { useJsonFile } from '../useJsonFile'
import SaveBar from '../components/SaveBar'
import FormField from '../components/FormField'

function nextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

function TestimonialsEditor({ token, onDirtyChange, showToast, confirmAction, registerSave }) {
  const { data, setData, loading, saving, error, save, isDirty } = useJsonFile(
    token,
    'src/data/testimonials.json'
  )
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const testimonials = data?.testimonials

  function update(index, field, value) {
    const next = [...testimonials]
    next[index] = { ...next[index], [field]: value }
    setData({ testimonials: next })
  }

  function addTestimonial() {
    setData({
      testimonials: [
        ...testimonials,
        { id: nextId(testimonials), quote: '', name: '' },
      ],
    })
  }

  async function removeTestimonial(index) {
    const ok = await confirmAction?.(
      `Remove the testimonial from "${testimonials[index].name || 'this client'}"?`
    )
    if (!ok) return
    setData({ testimonials: testimonials.filter((_, i) => i !== index) })
  }

  async function handleSave() {
    setLocalError(null)
    const emptyOne = testimonials.find(t => !t.quote.trim() || !t.name.trim())
    if (emptyOne) {
      setLocalError('Every testimonial needs both a quote and a name before saving.')
      return
    }
    const ok = await save(data, 'Update testimonials via admin panel')
    if (ok) showToast?.('Testimonials saved and pushed to GitHub.')
  }

  useEffect(() => {
    registerSave?.(handleSave)
  }, [registerSave, handleSave])

  if (loading) return <p className="admin-status">Loading testimonials…</p>
  if (error && !data) return <p className="admin-status admin-status-error">{error}</p>
  if (!data) return null

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Testimonials</h2>
      <p className="admin-section-subtitle">
        Only add real quotes from real clients — these show up on the live site as-is.
      </p>

      {testimonials.map((t, i) => (
        <div className="admin-card" key={t.id}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{t.name || 'New testimonial'}</h3>
            <button
              type="button"
              className="admin-icon-btn admin-remove-btn"
              onClick={() => removeTestimonial(i)}
              aria-label="Remove testimonial"
            >
              &times;
            </button>
          </div>
          <FormField label="Quote">
            <textarea
              rows={3}
              value={t.quote}
              onChange={e => update(i, 'quote', e.target.value)}
            />
          </FormField>
          <FormField
            label="Client name"
            hint="Must match a project's 'Client' field exactly to auto-link the quote"
          >
            <input
              type="text"
              value={t.name}
              onChange={e => update(i, 'name', e.target.value)}
            />
          </FormField>
        </div>
      ))}

      <button type="button" className="admin-add-btn" onClick={addTestimonial}>
        + Add Testimonial
      </button>

      {localError && <p className="admin-status admin-status-error">{localError}</p>}
      <SaveBar saving={saving} error={error} onSave={handleSave} />
    </div>
  )
}

export default TestimonialsEditor
