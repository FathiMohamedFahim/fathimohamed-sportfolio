import { useState, useEffect } from 'react'
import { useJsonFile } from '../useJsonFile'
import SaveBar from '../components/SaveBar'
import FormField from '../components/FormField'

const ICON_OPTIONS = [
  { value: 'bullhorn', label: 'Bullhorn (advertising)' },
  { value: 'share-alt', label: 'Share (social media)' },
  { value: 'object-ungroup', label: 'Layers (photo manipulation)' },
  { value: 'lightbulb', label: 'Lightbulb (concept/ideas)' },
  { value: 'shapes', label: 'Shapes (logo design)' },
  { value: 'camera-retro', label: 'Camera (photo editing)' },
]

function nextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

function ServicesEditor({ token, onDirtyChange }) {
  const { data, setData, loading, saving, error, savedAt, save, isDirty } = useJsonFile(
    token,
    'src/data/services.json'
  )
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  if (loading) return <p className="admin-status">Loading services…</p>
  if (error && !data) return <p className="admin-status admin-status-error">{error}</p>
  if (!data) return null

  const services = data.services

  function update(index, field, value) {
    const next = [...services]
    next[index] = { ...next[index], [field]: value }
    setData({ services: next })
  }

  function addService() {
    setData({
      services: [
        ...services,
        { id: nextId(services), iconClass: 'bullhorn', title: '', description: '' },
      ],
    })
  }

  function removeService(index) {
    if (services.length <= 1) {
      setLocalError('Keep at least one service.')
      return
    }
    if (!window.confirm('Remove this service?')) return
    setData({ services: services.filter((_, i) => i !== index) })
  }

  async function handleSave() {
    setLocalError(null)
    const emptyOne = services.find(s => !s.title.trim())
    if (emptyOne) {
      setLocalError('Every service needs a title before saving.')
      return
    }
    await save(data, 'Update services via admin panel')
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Services</h2>

      {services.map((service, i) => (
        <div className="admin-card" key={service.id}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{service.title || 'New service'}</h3>
            <button
              type="button"
              className="admin-icon-btn admin-remove-btn"
              onClick={() => removeService(i)}
              aria-label="Remove service"
            >
              &times;
            </button>
          </div>
          <FormField label="Icon" hint="Only these 6 icons are wired up on the site">
            <select
              value={service.iconClass}
              onChange={e => update(i, 'iconClass', e.target.value)}
            >
              {ICON_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Title">
            <input
              type="text"
              value={service.title}
              onChange={e => update(i, 'title', e.target.value)}
            />
          </FormField>
          <FormField label="Description">
            <textarea
              rows={2}
              value={service.description}
              onChange={e => update(i, 'description', e.target.value)}
            />
          </FormField>
        </div>
      ))}

      <button type="button" className="admin-add-btn" onClick={addService}>
        + Add Service
      </button>

      {localError && <p className="admin-status admin-status-error">{localError}</p>}
      <SaveBar saving={saving} error={error} savedAt={savedAt} onSave={handleSave} />
    </div>
  )
}

export default ServicesEditor
