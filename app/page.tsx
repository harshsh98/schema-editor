'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SchemaModal } from '@/components/schema-modal'
import type { Schema } from '../types/schema'

const defaultSchema: Schema = {
  type: 'object',
  properties: {
    response: {
      type: 'string'
    }
  },
  required: []
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [schema, setSchema] = useState<Schema>(defaultSchema)

  useEffect(() => {
    // Load schema from localStorage on component mount
    const savedSchema = localStorage.getItem('savedSchema')
    if (savedSchema) {
      setSchema(JSON.parse(savedSchema))
    }
  }, [])

  const handleSchemaChange = (newSchema: Schema) => {
    setSchema(newSchema)
    // Save schema to localStorage
    localStorage.setItem('savedSchema', JSON.stringify(newSchema))
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => setIsOpen(true)}>Modal</Button>
      <SchemaModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        schema={schema}
        onSave={handleSchemaChange}
      />
    </div>
  )
}

