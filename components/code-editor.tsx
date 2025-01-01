'use client'

import { useEffect, useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import type { Schema } from '../types/schema'

interface CodeEditorProps {
  schema: Schema
  onChange: (schema: Schema) => void
}

export function CodeEditor({ schema, onChange }: CodeEditorProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isUserEditing, setIsUserEditing] = useState(false)

  useEffect(() => {
    if (!isUserEditing) {
      const newCode = JSON.stringify(schema, null, 2)
      setCode(newCode)
    }
  }, [schema, isUserEditing])

  const handleCodeChange = (value: string) => {
    setCode(value)
    setIsUserEditing(true)
    try {
      const parsed = JSON.parse(value)
      setError(null)
      onChange(parsed)
    } catch (e) {
      setError('Invalid JSON')
    }
  }

  const handleBlur = () => {
    setIsUserEditing(false)
  }

  return (
    <div className="p-4 space-y-2">
      <Textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => handleCodeChange(e.target.value)}
        onBlur={handleBlur}
        className="font-mono h-[500px]"
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault()
            const start = e.currentTarget.selectionStart
            const end = e.currentTarget.selectionEnd
            const newCode = code.substring(0, start) + '  ' + code.substring(end)
            setCode(newCode)
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
              }
            }, 0)
          }
        }}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}

