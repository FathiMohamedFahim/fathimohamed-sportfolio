import { useState } from 'react'
import { useJsonFile } from '../useJsonFile'
import SaveBar from '../components/SaveBar'
import FormField from '../components/FormField'

function SiteEditor({ token }) {
  const { data, setData, loading, saving, error, savedAt, save } = useJsonFile(
    token,
    'src/data/site.json'
  )
  const [localError, setLocalError] = useState(null)

  if (loading) return <p className="admin-status">Loading site content…</p>
  if (error) return <p className="admin-status admin-status-error">{error}</p>
  if (!data) return null

  function updateSection(section, field, value) {
    setData({ ...data, [section]: { ...data[section], [field]: value } })
  }

  function updateStat(index, field, value) {
    const stats = [...data.about.stats]
    stats[index] = { ...stats[index], [field]: value }
    updateSection('about', 'stats', stats)
  }

  function addStat() {
    if (data.about.stats.length >= 4) return
    updateSection('about', 'stats', [...data.about.stats, { number: '', label: '' }])
  }

  function removeStat(index) {
    const stats = data.about.stats.filter((_, i) => i !== index)
    updateSection('about', 'stats', stats)
  }

  async function handleSave() {
    setLocalError(null)
    if (!data.contact.email.includes('@')) {
      setLocalError('Contact email looks invalid.')
      return
    }
    await save(data, 'Update site settings via admin panel')
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Site Settings</h2>

      <div className="admin-card">
        <h3 className="admin-card-title">Hero Section</h3>
        <FormField label="Eyebrow text" hint="Small text above your name">
          <input
            type="text"
            value={data.hero.eyebrow}
            onChange={e => updateSection('hero', 'eyebrow', e.target.value)}
          />
        </FormField>
        <FormField label="Available for new work?">
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={data.hero.availableForWork}
              onChange={e => updateSection('hero', 'availableForWork', e.target.checked)}
            />
            <span>{data.hero.availableForWork ? 'Yes, showing badge' : 'No, badge hidden'}</span>
          </label>
        </FormField>
        {data.hero.availableForWork && (
          <FormField label="Availability badge text">
            <input
              type="text"
              value={data.hero.availabilityText}
              onChange={e => updateSection('hero', 'availabilityText', e.target.value)}
            />
          </FormField>
        )}
        <FormField label="Subtitle">
          <input
            type="text"
            value={data.hero.subtitle}
            onChange={e => updateSection('hero', 'subtitle', e.target.value)}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            rows={3}
            value={data.hero.description}
            onChange={e => updateSection('hero', 'description', e.target.value)}
          />
        </FormField>
        <div className="admin-field-row">
          <FormField label="Primary button text">
            <input
              type="text"
              value={data.hero.primaryCtaText}
              onChange={e => updateSection('hero', 'primaryCtaText', e.target.value)}
            />
          </FormField>
          <FormField label="Secondary button text">
            <input
              type="text"
              value={data.hero.secondaryCtaText}
              onChange={e => updateSection('hero', 'secondaryCtaText', e.target.value)}
            />
          </FormField>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">About Section</h3>
        <FormField label="Heading">
          <input
            type="text"
            value={data.about.title}
            onChange={e => updateSection('about', 'title', e.target.value)}
          />
        </FormField>
        <FormField label="Bio paragraph 1">
          <textarea
            rows={4}
            value={data.about.bio1}
            onChange={e => updateSection('about', 'bio1', e.target.value)}
          />
        </FormField>
        <FormField label="Bio paragraph 2">
          <textarea
            rows={3}
            value={data.about.bio2}
            onChange={e => updateSection('about', 'bio2', e.target.value)}
          />
        </FormField>
        <FormField label="Photo path" hint="e.g. /designs-img/0007-Spero Spathis/0001-Social media design.png — upload new images from the Projects tab, then paste the path here">
          <input
            type="text"
            value={data.about.image}
            onChange={e => updateSection('about', 'image', e.target.value)}
          />
        </FormField>

        <label className="admin-label">Stats ({data.about.stats.length}/4)</label>
        {data.about.stats.map((stat, i) => (
          <div className="admin-field-row admin-list-row" key={i}>
            <input
              type="text"
              placeholder="9+"
              value={stat.number}
              onChange={e => updateStat(i, 'number', e.target.value)}
            />
            <input
              type="text"
              placeholder="Projects Delivered"
              value={stat.label}
              onChange={e => updateStat(i, 'label', e.target.value)}
            />
            <button
              type="button"
              className="admin-icon-btn admin-remove-btn"
              onClick={() => removeStat(i)}
              aria-label="Remove stat"
            >
              &times;
            </button>
          </div>
        ))}
        {data.about.stats.length < 4 && (
          <button type="button" className="admin-add-btn" onClick={addStat}>
            + Add stat
          </button>
        )}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Contact Info</h3>
        <FormField label="Email">
          <input
            type="email"
            value={data.contact.email}
            onChange={e => updateSection('contact', 'email', e.target.value)}
          />
        </FormField>
        <div className="admin-field-row">
          <FormField label="WhatsApp (displayed)">
            <input
              type="text"
              value={data.contact.whatsappDisplay}
              onChange={e => updateSection('contact', 'whatsappDisplay', e.target.value)}
            />
          </FormField>
          <FormField label="WhatsApp link">
            <input
              type="text"
              value={data.contact.whatsappLink}
              onChange={e => updateSection('contact', 'whatsappLink', e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="WhatsApp floating button link">
          <input
            type="text"
            value={data.contact.whatsappFloatLink}
            onChange={e => updateSection('contact', 'whatsappFloatLink', e.target.value)}
          />
        </FormField>
        <FormField label="Location">
          <input
            type="text"
            value={data.contact.location}
            onChange={e => updateSection('contact', 'location', e.target.value)}
          />
        </FormField>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Social Links</h3>
        {['behance', 'instagram', 'linkedin', 'facebook', 'github'].map(key => (
          <FormField label={key[0].toUpperCase() + key.slice(1)} key={key}>
            <input
              type="text"
              value={data.social[key]}
              onChange={e => updateSection('social', key, e.target.value)}
            />
          </FormField>
        ))}
      </div>

      {localError && <p className="admin-status admin-status-error">{localError}</p>}
      <SaveBar saving={saving} error={error} savedAt={savedAt} onSave={handleSave} />
    </div>
  )
}

export default SiteEditor
