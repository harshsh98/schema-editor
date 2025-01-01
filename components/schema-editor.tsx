'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VisualEditor } from './visual-editor'
import { CodeEditor } from './code-editor'
import type { Schema } from '../types/schema'

interface SchemaEditorProps {
  schema: Schema
  onChange: (schema: Schema) => void
}

export default function SchemaEditor({ schema, onChange }: SchemaEditorProps) {
  const [localSchema, setLocalSchema] = useState<Schema>(schema)

  useEffect(() => {
    setLocalSchema(schema)
  }, [schema])

  const handleSchemaChange = (newSchema: Schema) => {
    setLocalSchema(newSchema)
    onChange(newSchema)
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual Editor</TabsTrigger>
          <TabsTrigger value="code">Code View</TabsTrigger>
        </TabsList>
        <TabsContent value="visual">
          <VisualEditor schema={localSchema} onChange={handleSchemaChange} />
        </TabsContent>
        <TabsContent value="code">
          <CodeEditor schema={localSchema} onChange={handleSchemaChange} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

