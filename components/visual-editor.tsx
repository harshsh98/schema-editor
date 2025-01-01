'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PropertyEditor } from './property-editor'
import type { Schema, SchemaProperty } from '../types/schema'
import { useState, useEffect } from 'react'

interface VisualEditorProps {
  schema: Schema
  onChange: (schema: Schema) => void
}

export function VisualEditor({ schema, onChange }: VisualEditorProps) {
  const [properties, setProperties] = useState(schema.properties)
  const [required, setRequired] = useState(schema.required)

  useEffect(() => {
    setProperties(schema.properties)
    setRequired(schema.required)
  }, [schema])

  const handlePropertyUpdate = (
    oldKey: string,
    newKey: string,
    property: SchemaProperty,
    isRequired: boolean
  ) => {
    const newProperties = { ...properties }
    if (oldKey !== newKey) {
      delete newProperties[oldKey]
    }
    newProperties[newKey] = property

    let newRequired = [...required]
    if (isRequired && !newRequired.includes(newKey)) {
      newRequired.push(newKey)
    } else if (!isRequired) {
      newRequired = newRequired.filter(k => k !== newKey)
    }

    setProperties(newProperties)
    setRequired(newRequired)

    onChange({
      ...schema,
      properties: newProperties,
      required: newRequired
    })
  }

  const handlePropertyDelete = (key: string) => {
    const newProperties = { ...properties }
    delete newProperties[key]
    const newRequired = required.filter(k => k !== key)

    setProperties(newProperties)
    setRequired(newRequired)

    onChange({
      ...schema,
      properties: newProperties,
      required: newRequired
    })
  }

  const addProperty = () => {
    let newKey = 'newProperty'
    let counter = 1
    while (properties.hasOwnProperty(newKey)) {
      newKey = `newProperty${counter}`
      counter++
    }
    const newProperties = {
      ...properties,
      [newKey]: { type: 'string' }
    }
    setProperties(newProperties)

    onChange({
      ...schema,
      properties: newProperties
    })
  }

  return (
    <div className="p-4 space-y-4">
      {Object.entries(properties).map(([key, property]) => (
        <PropertyEditor
          key={key}
          propertyKey={key}
          property={property}
          isRequired={required.includes(key)}
          onUpdate={(newKey, updatedProperty, isRequired) => 
            handlePropertyUpdate(key, newKey, updatedProperty, isRequired)
          }
          onDelete={handlePropertyDelete}
        />
      ))}
      <Button onClick={addProperty} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Property
      </Button>
    </div>
  )
}

