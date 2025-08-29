export interface IntakeSchema {
  title: string;
  version: string;
  description: string;
  sections: IntakeSection[];
  ui: UIConfig;
}

export interface IntakeSection {
  id: string;
  title: string;
  fields: IntakeField[];
}

export interface IntakeField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  pattern?: string;
  options?: string[];
  reveals?: Record<string, string[]>;
  visibleIf?: Record<string, any>;
  accept?: string[];
  multiple?: boolean;
  fileMeta?: string[];
  itemFields?: IntakeField[];
  min?: number;
  max?: number;
  minDate?: string;
  maxDate?: string;
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'tel' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'toggle' 
  | 'date' 
  | 'month' 
  | 'number' 
  | 'file' 
  | 'repeater'
  | 'multiselect';

export interface UIConfig {
  progress: boolean;
  autosave: boolean;
  allowDraftResume: boolean;
  fileConstraints: FileConstraints;
}

export interface FileConstraints {
  maxSizeMB: number;
  maxFiles: number;
}

export interface IntakeFormValue {
  [sectionId: string]: {
    [fieldId: string]: any;
  };
}

export interface FileUploadMetadata {
  url: string;
  filename: string;
  clientId?: string;
  uploadedAt: Date;
  description?: string;
  size: number;
  type: string;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  fieldId: string;
  sectionId: string;
  message: string;
}

export interface AutosaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
}
