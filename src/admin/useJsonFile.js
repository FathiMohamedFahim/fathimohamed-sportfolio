import { useState, useEffect, useCallback, useRef } from 'react'
import { getJsonFile, updateJsonFile } from './github'

export function useJsonFile(token, path) {
  const [data, setData] = useState(null)
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [savedAt, setSavedAt] = useState(null)
  const originalRef = useRef(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    getJsonFile(token, path)
      .then(({ json, sha }) => {
        setData(json)
        setSha(sha)
        originalRef.current = JSON.stringify(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [token, path])

  useEffect(() => {
    load()
  }, [load])

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
