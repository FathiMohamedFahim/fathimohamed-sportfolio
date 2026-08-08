import { useState, useEffect, useCallback, useRef } from 'react'
import { getJsonFile, updateJsonFile } from './github'

// Shared across every useJsonFile(path) consumer mounted at once (e.g. an
// editor tab and the Dashboard both want src/data/projects.json). Without
// this, every consumer fetched the same file independently — up to 7
// requests for 3 unique files on a single login, since the admin app keeps
// every tab's section mounted simultaneously rather than lazily.
//
// Only the last known GOOD value (fetched from GitHub, or successfully
// saved to GitHub) ever lives here — an editor's in-progress, unsaved
// keystrokes stay in that hook instance's own local state and are never
// written into this cache, so e.g. Dashboard's stat counts can't reflect
// someone else's still-being-typed, unsaved edit.
const cache = new Map() // path -> { data, sha, error, promise, listeners: Set<fn> }

function getCacheEntry(path) {
  let entry = cache.get(path)
  if (!entry) {
    entry = { data: null, sha: null, error: null, promise: null, listeners: new Set() }
    cache.set(path, entry)
  }
  return entry
}

function notify(entry) {
  entry.listeners.forEach(fn => fn(entry))
}

function loadFromCache(token, path) {
  const entry = getCacheEntry(path)
  if (entry.data !== null) return Promise.resolve(entry)
  if (entry.promise) return entry.promise // already in flight — share it, don't re-fetch

  entry.promise = getJsonFile(token, path)
    .then(({ json, sha }) => {
      entry.data = json
      entry.sha = sha
      entry.error = null
      entry.promise = null
      notify(entry)
      return entry
    })
    .catch(err => {
      entry.error = err.message
      entry.promise = null
      notify(entry)
      throw err
    })

  return entry.promise
}

function updateCache(path, data, sha) {
  const entry = getCacheEntry(path)
  entry.data = data
  entry.sha = sha
  entry.error = null
  notify(entry)
}

export function useJsonFile(token, path) {
  const [data, setData] = useState(null)
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [savedAt, setSavedAt] = useState(null)
  const originalRef = useRef(null)

  const applyEntry = useCallback(entry => {
    if (entry.error) {
      setError(entry.error)
      setLoading(false)
      return
    }
    if (entry.data !== null) {
      setData(entry.data)
      setSha(entry.sha)
      originalRef.current = JSON.stringify(entry.data)
      setLoading(false)
      setError(null)
    }
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    cache.delete(path) // force a genuine re-fetch, not the cached value
    loadFromCache(token, path)
      .then(applyEntry)
      .catch(() => {})
  }, [token, path, applyEntry])

  useEffect(() => {
    const entry = getCacheEntry(path)
    const listener = updatedEntry => applyEntry(updatedEntry)
    entry.listeners.add(listener)

    if (entry.data !== null) {
      applyEntry(entry) // already cached by another consumer — no network call
    } else {
      loadFromCache(token, path)
        .then(applyEntry)
        .catch(() => {})
    }

    return () => entry.listeners.delete(listener)
  }, [token, path, applyEntry])

  const save = useCallback(
    async (newData, message) => {
      setSaving(true)
      setError(null)
      try {
        const { sha: newSha } = await updateJsonFile(token, path, newData, sha, message)
        setSha(newSha)
        setData(newData)
        originalRef.current = JSON.stringify(newData)
        setSavedAt(Date.now())
        setSaving(false)
        // Propagate the fresh saved value to every other subscriber of this
        // path (e.g. Dashboard's stat count updates immediately, not only
        // on the next full page reload).
        updateCache(path, newData, newSha)
        return true
      } catch (err) {
        setError(err.message)
        setSaving(false)
        return false
      }
    },
    [token, path, sha]
  )

  const isDirty = data !== null && JSON.stringify(data) !== originalRef.current

  return { data, setData, loading, saving, error, savedAt, save, reload: load, isDirty }
}
