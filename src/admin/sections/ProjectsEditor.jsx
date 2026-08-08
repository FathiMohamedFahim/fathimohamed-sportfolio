import { useState, useEffect } from 'react'
import { useJsonFile } from '../useJsonFile'
import { uploadImage, validateImageFile } from '../github'
import SaveBar from '../components/SaveBar'
import FormField from '../components/FormField'
import { TOOLS, PROJECT_CATEGORIES, PROJECT_CATEGORY_LABELS } from '../../data/taxonomies'

const CATEGORY_OPTIONS = PROJECT_CATEGORIES
const CATEGORY_LABEL_OPTIONS = PROJECT_CATEGORY_LABELS
const TOOL_OPTIONS = TOOLS

function nextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

function emptyProject(id) {
  return {
    id,
    category: 'social',
    categoryLabel: 'Social Media Design',
    title: '',
    client: '',
    description: '',
    tools: [],
    role: '',
    images: [],
    link: '#',
  }
}

function ProjectsEditor({ token, onDirtyChange, showToast, confirmAction, registerSave }) {
  const { data, setData, loading, saving, error, save, isDirty } = useJsonFile(
    token,
    'src/data/projects.json'
  )
  const [localError, setLocalError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [uploadingFor, setUploadingFor] = useState(null)
  const [customTool, setCustomTool] = useState('')

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const projects = data?.projects

  function updateProject(index, field, value) {
    const next = [...projects]
    next[index] = { ...next[index], [field]: value }
    setData({ projects: next })
  }

  function addProject() {
    const id = nextId(projects)
    setData({ projects: [...projects, emptyProject(id)] })
    setExpandedId(id)
  }

  async function removeProject(index) {
    const ok = await confirmAction?.(
      `Remove "${projects[index].title || 'this project'}"? This can't be undone from here.`
    )
    if (!ok) return
    setData({ projects: projects.filter((_, i) => i !== index) })
  }

  function toggleTool(index, tool) {
    const project = projects[index]
    const has = project.tools.includes(tool)
    const nextTools = has ? project.tools.filter(t => t !== tool) : [...project.tools, tool]
    updateProject(index, 'tools', nextTools)
  }

  function updateImage(index, imgIndex, field, value) {
    const project = projects[index]
    const images = [...project.images]
    images[imgIndex] = { ...images[imgIndex], [field]: value }
    updateProject(index, 'images', images)
  }

  async function removeImage(index, imgIndex) {
    const project = projects[index]
    if (project.images.length === 1) {
      const ok = await confirmAction?.(
        `Remove this image? "${project.title || 'This project'}" will have no images left until you upload another.`
      )
      if (!ok) return
    } else {
      const ok = await confirmAction?.('Remove this image?')
      if (!ok) return
    }
    updateProject(
      index,
      'images',
      project.images.filter((_, i) => i !== imgIndex)
    )
  }

  function moveImage(index, imgIndex, direction) {
    const project = projects[index]
    const images = [...project.images]
    const targetIndex = imgIndex + direction
    if (targetIndex < 0 || targetIndex >= images.length) return
    ;[images[imgIndex], images[targetIndex]] = [images[targetIndex], images[imgIndex]]
    updateProject(index, 'images', images)
  }

  function addCustomTool(index) {
    const tool = customTool.trim()
    if (!tool) return
    const project = projects[index]
    if (!project.tools.includes(tool)) {
      updateProject(index, 'tools', [...project.tools, tool])
    }
    setCustomTool('')
  }

  async function handleImageUpload(index, file) {
    const validationError = validateImageFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    setUploadingFor(`${index}`)
    setLocalError(null)
    try {
      const path = await uploadImage(token, file)
      const project = projects[index]
      updateProject(index, 'images', [
        ...project.images,
        { src: path, alt: project.title, label: '' },
      ])
      showToast?.('Image uploaded to GitHub.')
    } catch (err) {
      setLocalError(err.message)
    }
    setUploadingFor(null)
  }

  async function handleSave() {
    setLocalError(null)
    const badOne = projects.find(p => !p.title.trim() || p.images.length === 0)
    if (badOne) {
      setLocalError('Every project needs a title and at least one image before saving.')
      return
    }
    const ok = await save(data, 'Update projects via admin panel')
    if (ok) showToast?.('Projects saved and pushed to GitHub.')
  }

  useEffect(() => {
    registerSave?.(handleSave)
  }, [registerSave, handleSave])

  if (loading) return <p className="admin-status">Loading projects…</p>
  if (error && !data) return <p className="admin-status admin-status-error">{error}</p>
  if (!data) return null

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Projects</h2>

      {projects.map((project, i) => {
        const isOpen = expandedId === project.id
        return (
          <div className="admin-card admin-project-card" key={project.id}>
            <div
              className="admin-card-header admin-project-summary"
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${project.title || 'New project'}`}
              onClick={() => setExpandedId(isOpen ? null : project.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setExpandedId(isOpen ? null : project.id)
                }
              }}
            >
              {project.images[0] && (
                <img
                  src={project.images[0].src}
                  alt=""
                  className="admin-project-thumb"
                />
              )}
              <div className="admin-project-summary-text">
                <h3 className="admin-card-title">{project.title || 'New project'}</h3>
                <span className="admin-project-summary-meta">
                  {project.categoryLabel} · {project.images.length} image
                  {project.images.length === 1 ? '' : 's'}
                </span>
              </div>
              <span className="admin-expand-btn" aria-hidden="true">
                {isOpen ? 'Close' : 'Edit'}
              </span>
            </div>

            {isOpen && (
              <div className="admin-project-body">
                <div className="admin-field-row">
                  <FormField label="Category" hint="Controls which filter shows this project">
                    <select
                      value={project.category}
                      onChange={e => updateProject(i, 'category', e.target.value)}
                    >
                      {CATEGORY_OPTIONS.map(opt => (
                        <option value={opt} key={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Category Label (shown on site)">
                    <select
                      value={project.categoryLabel}
                      onChange={e => updateProject(i, 'categoryLabel', e.target.value)}
                    >
                      {CATEGORY_LABEL_OPTIONS.map(opt => (
                        <option value={opt} key={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Title">
                  <input
                    type="text"
                    value={project.title}
                    onChange={e => updateProject(i, 'title', e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Client (optional)"
                  hint="Must exactly match a testimonial's client name to auto-link the quote"
                >
                  <input
                    type="text"
                    value={project.client || ''}
                    onChange={e => updateProject(i, 'client', e.target.value)}
                  />
                </FormField>

                <FormField label="Description">
                  <textarea
                    rows={2}
                    value={project.description}
                    onChange={e => updateProject(i, 'description', e.target.value)}
                  />
                </FormField>

                <FormField label="Role">
                  <input
                    type="text"
                    value={project.role}
                    onChange={e => updateProject(i, 'role', e.target.value)}
                  />
                </FormField>

                <label className="admin-label">Tools used</label>
                <div className="admin-tool-chips">
                  {TOOL_OPTIONS.map(tool => (
                    <button
                      type="button"
                      key={tool}
                      className={`admin-chip${project.tools.includes(tool) ? ' active' : ''}`}
                      onClick={() => toggleTool(i, tool)}
                    >
                      {tool}
                    </button>
                  ))}
                  {project.tools
                    .filter(t => !TOOL_OPTIONS.includes(t))
                    .map(tool => (
                      <button
                        type="button"
                        key={tool}
                        className="admin-chip active"
                        onClick={() => toggleTool(i, tool)}
                        title="Custom tool — click to remove"
                      >
                        {tool}
                      </button>
                    ))}
                </div>
                <div className="admin-custom-tool-row">
                  <input
                    type="text"
                    placeholder="Other tool not listed…"
                    value={customTool}
                    onChange={e => setCustomTool(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomTool(i)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="admin-expand-btn"
                    onClick={() => addCustomTool(i)}
                  >
                    Add
                  </button>
                </div>

                <label className="admin-label">Images</label>
                {project.images.map((img, imgIndex) => (
                  <div className="admin-image-row" key={imgIndex}>
                    <img src={img.src} alt="" className="admin-image-row-thumb" />
                    {imgIndex === 0 && <span className="admin-cover-badge">Cover</span>}
                    <div className="admin-image-row-fields">
                      <input
                        type="text"
                        placeholder="Label (e.g. Logo Mockup)"
                        value={img.label}
                        onChange={e => updateImage(i, imgIndex, 'label', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Alt text"
                        value={img.alt}
                        onChange={e => updateImage(i, imgIndex, 'alt', e.target.value)}
                      />
                    </div>
                    {project.images.length > 1 && (
                      <div className="admin-image-row-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          onClick={() => moveImage(i, imgIndex, -1)}
                          disabled={imgIndex === 0}
                          aria-label="Move image up"
                          title="Move up (makes it the cover if moved to first)"
                        >
                          &uarr;
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          onClick={() => moveImage(i, imgIndex, 1)}
                          disabled={imgIndex === project.images.length - 1}
                          aria-label="Move image down"
                        >
                          &darr;
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-remove-btn"
                          onClick={() => removeImage(i, imgIndex)}
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                    {project.images.length === 1 && (
                      <button
                        type="button"
                        className="admin-icon-btn admin-remove-btn"
                        onClick={() => removeImage(i, imgIndex)}
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}

                <label className="admin-upload-btn">
                  {uploadingFor === `${i}` ? 'Uploading…' : '+ Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingFor === `${i}`}
                    onChange={e => {
                      if (e.target.files[0]) handleImageUpload(i, e.target.files[0])
                      e.target.value = ''
                    }}
                  />
                </label>

                <FormField label="Behance link" hint="Leave as # if none">
                  <input
                    type="text"
                    value={project.link}
                    onChange={e => updateProject(i, 'link', e.target.value)}
                  />
                </FormField>

                <details className="admin-case-study">
                  <summary>Case Study (optional)</summary>
                  <FormField label="The Ask">
                    <textarea
                      rows={2}
                      value={project.challenge || ''}
                      onChange={e => updateProject(i, 'challenge', e.target.value)}
                    />
                  </FormField>
                  <FormField label="The Approach">
                    <textarea
                      rows={2}
                      value={project.approach || ''}
                      onChange={e => updateProject(i, 'approach', e.target.value)}
                    />
                  </FormField>
                  <FormField label="The Result">
                    <textarea
                      rows={2}
                      value={project.result || ''}
                      onChange={e => updateProject(i, 'result', e.target.value)}
                    />
                  </FormField>
                </details>

                <button
                  type="button"
                  className="admin-remove-project-btn"
                  onClick={() => removeProject(i)}
                >
                  Remove this project
                </button>
              </div>
            )}
          </div>
        )
      })}

      <button type="button" className="admin-add-btn" onClick={addProject}>
        + Add Project
      </button>

      {localError && <p className="admin-status admin-status-error">{localError}</p>}
      <SaveBar saving={saving} error={error} onSave={handleSave} />
    </div>
  )
}

export default ProjectsEditor
