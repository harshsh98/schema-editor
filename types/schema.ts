export type SchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'enum';

export interface SchemaPropertyBase {
  type: SchemaType | 'array';
  description?: string;
  items?: SchemaProperty;
}

export interface StringProperty extends SchemaPropertyBase {
  type: 'string' | 'array';
  enum?: string[];
  items?: StringProperty;
}

export interface NumberProperty extends SchemaPropertyBase {
  type: 'number' | 'integer' | 'array';
  items?: NumberProperty;
}

export interface BooleanProperty extends SchemaPropertyBase {
  type: 'boolean' | 'array';
  items?: BooleanProperty;
}

export interface ObjectProperty extends SchemaPropertyBase {
  type: 'object' | 'array';
  properties: Record<string, SchemaProperty>;
  required?: string[];
  items?: ObjectProperty;
}

export type SchemaProperty = 
  | StringProperty 
  | NumberProperty 
  | BooleanProperty 
  | ObjectProperty;

export interface Schema {
  type: 'object';
  properties: Record<string, SchemaProperty>;
  required: string[];
}

