'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash } from 'lucide-react'
import type { Schema, SchemaProperty, SchemaType } from '../types/schema'

interface PropertyEditorProps {
  propertyKey: string
  property: SchemaProperty
  isRequired: boolean
  onUpdate: (key: string, property: SchemaProperty, isRequired: boolean) => void
  onDelete: (key: string) => void
  level?: number
}

export function PropertyEditor({
  propertyKey,
  property,
  isRequired,
  onUpdate,
  onDelete,
  level = 0
}: PropertyEditorProps) {
  const [localKey, setLocalKey] = useState(propertyKey)
  const [localProperty, setLocalProperty] = useState<SchemaProperty>(property)
  const [localIsRequired, setLocalIsRequired] = useState(isRequired)
  const [isArray, setIsArray] = useState(property.type === 'array')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalKey(propertyKey)
    setLocalProperty(property)
    setLocalIsRequired(isRequired)
    setIsArray(property.type === 'array')
  }, [propertyKey, property, isRequired])

  const handleKeyChange = (newKey: string) => {
    setLocalKey(newKey)
  }

  const handleKeyBlur = () => {
    if (localKey !== propertyKey) {
      if (localKey.trim() === '') {
        setLocalKey(propertyKey)
      } else {
        onUpdate(localKey, localProperty, localIsRequired)
      }
    }
  }

  const handleTypeChange = (type: SchemaType) => {
    let newProperty: SchemaProperty

    if (type === 'enum') {
      newProperty = { type: 'string', enum: [] }
    } else {
      switch (type) {
        case 'object':
          newProperty = { type: 'object', properties: {}, required: [] }
          break
        default:
          newProperty = { type }
      }
    }

    if (localProperty.description) {
      newProperty.description = localProperty.description
    }

    if (isArray) {
      newProperty = {
        type: 'array',
        items: newProperty
      }
    }

    setLocalProperty(newProperty)
    onUpdate(localKey, newProperty, localIsRequired)
  }

  const handleIsArrayChange = (checked: boolean) => {
    setIsArray(checked)
    let newProperty: SchemaProperty

    if (checked) {
      newProperty = {
        type: 'array',
        items: { ...localProperty }
      }
    } else {
      newProperty = localProperty.items || { type: 'string' }
    }

    setLocalProperty(newProperty)
    onUpdate(localKey, newProperty, localIsRequired)
  }

  const handleRequiredChange = (checked: boolean) => {
    setLocalIsRequired(checked)
    onUpdate(localKey, localProperty, checked)
  }

  const handleEnumValueAdd = () => {
    if ('enum' in localProperty || (localProperty.type === 'array' && 'enum' in localProperty.items)) {
      const targetProperty = localProperty.type === 'array' ? localProperty.items : localProperty
      const newEnum = [...(targetProperty.enum || []), '']
      
      const newProperty = localProperty.type === 'array'
        ? { ...localProperty, items: { ...targetProperty, enum: newEnum } }
        : { ...localProperty, enum: newEnum }
      
      setLocalProperty(newProperty)
      onUpdate(localKey, newProperty, localIsRequired)
    }
  }

  const handleEnumValueUpdate = (index: number, value: string) => {
    if ('enum' in localProperty || (localProperty.type === 'array' && 'enum' in localProperty.items)) {
      const targetProperty = localProperty.type === 'array' ? localProperty.items : localProperty
      const newEnum = [...(targetProperty.enum || [])]
      newEnum[index] = value
      
      const newProperty = localProperty.type === 'array'
        ? { ...localProperty, items: { ...targetProperty, enum: newEnum } }
        : { ...localProperty, enum: newEnum }
      
      setLocalProperty(newProperty)
      onUpdate(localKey, newProperty, localIsRequired)
    }
  }

  const handleEnumValueDelete = (index: number) => {
    if ('enum' in localProperty || (localProperty.type === 'array' && 'enum' in localProperty.items)) {
      const targetProperty = localProperty.type === 'array' ? localProperty.items : localProperty
      const newEnum = (targetProperty.enum || []).filter((_, i) => i !== index)
      
      const newProperty = localProperty.type === 'array'
        ? { ...localProperty, items: { ...targetProperty, enum: newEnum } }
        : { ...localProperty, enum: newEnum }
      
      setLocalProperty(newProperty)
      onUpdate(localKey, newProperty, localIsRequired)
    }
  }

  const actualType = localProperty.type === 'array' 
    ? localProperty.items?.type 
    : 'enum' in localProperty 
      ? 'enum' 
      : localProperty.type

  return (
    <div className="space-y-4 ml-4">
      <div className="grid grid-cols-12 gap-4 items-start">
        <Input
          className="col-span-3"
          value={localKey}
          onChange={(e) => handleKeyChange(e.target.value)}
          onBlur={handleKeyBlur}
          placeholder="Property name"
          ref={inputRef}
        />
        <Select
          value={actualType}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="col-span-2">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="integer">Integer</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="object">Object</SelectItem>
            <SelectItem value="enum">Enum</SelectItem>
          </SelectContent>
        </Select>
        <div className="col-span-2 flex items-center space-x-2">
          <Checkbox
            id={`required-${localKey}`}
            checked={localIsRequired}
            onCheckedChange={handleRequiredChange}
          />
          <label htmlFor={`required-${localKey}`}>Required</label>
        </div>
        <div className="col-span-2 flex items-center space-x-2">
          <Checkbox
            id={`array-${localKey}`}
            checked={isArray}
            onCheckedChange={handleIsArrayChange}
          />
          <label htmlFor={`array-${localKey}`}>Is Array</label>
        </div>
        <Textarea
          className="col-span-2"
          value={localProperty.description || ''}
          onChange={(e) => {
            const newProperty = {
              ...localProperty,
              description: e.target.value
            }
            setLocalProperty(newProperty)
            onUpdate(localKey, newProperty, localIsRequired)
          }}
          placeholder="Description"
        />
        <Button
          variant="ghost"
          size="icon"
          className="col-span-1"
          onClick={() => onDelete(localKey)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {'enum' in localProperty || (localProperty.type === 'array' && 'enum' in localProperty.items) ? (
        <div className="space-y-2 ml-4">
          {((localProperty.type === 'array' ? localProperty.items?.enum : localProperty.enum) || []).map((value, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={value}
                onChange={(e) => handleEnumValueUpdate(index, e.target.value)}
                placeholder="Enum value"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEnumValueDelete(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={handleEnumValueAdd}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Enum Value
          </Button>
        </div>
      ) : null}

      {actualType === 'object' && (
        <div className="space-y-2 ml-4">
          {Object.entries(localProperty.type === 'object' ? localProperty.properties : localProperty.items?.properties || {}).map(([key, prop]) => (
            <PropertyEditor
              key={key}
              propertyKey={key}
              property={prop}
              isRequired={localProperty.type === 'object' 
                ? localProperty.required?.includes(key) || false
                : localProperty.items?.required?.includes(key) || false}
              onUpdate={(newKey, newProp, newRequired) => {
                const targetProperty = localProperty.type === 'object' ? localProperty : localProperty.items
                const newProperties = { ...targetProperty.properties }
                if (key !== newKey) {
                  delete newProperties[key]
                }
                newProperties[newKey] = newProp

                let updatedRequired = targetProperty.required || []
                if (newRequired && !updatedRequired.includes(newKey)) {
                  updatedRequired = [...updatedRequired, newKey]
                } else if (!newRequired) {
                  updatedRequired = updatedRequired.filter(k => k !== newKey)
                }

                const newProperty = localProperty.type === 'object'
                  ? {
                      ...localProperty,
                      properties: newProperties,
                      required: updatedRequired
                    }
                  : {
                      ...localProperty,
                      items: {
                        ...localProperty.items,
                        properties: newProperties,
                        required: updatedRequired
                      }
                    }
                setLocalProperty(newProperty)
                onUpdate(localKey, newProperty, localIsRequired)
              }}
              onDelete={(keyToDelete) => {
                const targetProperty = localProperty.type === 'object' ? localProperty : localProperty.items
                const newProperties = { ...targetProperty.properties }
                delete newProperties[keyToDelete]
                const newProperty = localProperty.type === 'object'
                  ? { ...localProperty, properties: newProperties }
                  : { ...localProperty, items: { ...localProperty.items, properties: newProperties } }
                setLocalProperty(newProperty)
                onUpdate(localKey, newProperty, localIsRequired)
              }}
              level={level + 1}
            />
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const targetProperty = localProperty.type === 'object' ? localProperty : localProperty.items
              let newKey = 'newProperty'
              let counter = 1
              while (targetProperty.properties.hasOwnProperty(newKey)) {
                newKey = `newProperty${counter}`
                counter++
              }
              const newProperties = {
                ...targetProperty.properties,
                [newKey]: { type: 'string' }
              }
              const newProperty = localProperty.type === 'object'
                ? { ...localProperty, properties: newProperties }
                : { ...localProperty, items: { ...localProperty.items, properties: newProperties } }
              setLocalProperty(newProperty)
              onUpdate(localKey, newProperty, localIsRequired)
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Nested Property
          </Button>
        </div>
      )}
    </div>
  )
}

