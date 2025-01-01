'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import SchemaEditor from './schema-editor'
import type { Schema } from '../types/schema'

interface SchemaModalProps {
  isOpen: boolean
  onClose: () => void
  schema: Schema
  onSave: (schema: Schema) => void
}

const defaultSchema: Schema = {
  type: 'object',
  properties: {
    response: {
      type: 'string'
    }
  },
  required: []
}

export function SchemaModal({ isOpen, onClose, schema, onSave }: SchemaModalProps) {
  const [tempSchema, setTempSchema] = useState<Schema>(schema)

  useEffect(() => {
    setTempSchema(schema)
  }, [schema])

  const handleSave = () => {
    onSave(tempSchema)
    onClose()
  }

  const handleReset = () => {
    setTempSchema(defaultSchema)
    onSave(defaultSchema)
  }

  const handleClose = () => {
    setTempSchema(schema)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Structured output schema</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <SchemaEditor schema={tempSchema} onChange={setTempSchema} />
        </div>
        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

