import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IntakeSchema } from '../models/intake.models';

@Injectable({
  providedIn: 'root'
})
export class SchemaLoaderService {
  private schema: IntakeSchema | null = null;

  constructor(private http: HttpClient) {}

  loadSchema(): Observable<IntakeSchema> {
    if (this.schema) {
      return of(this.schema);
    }

    return this.http.get<IntakeSchema>('/assets/intake/intake.schema.json').pipe(
      map(schema => {
        this.schema = this.normalizeSchema(schema);
        return this.schema;
      }),
      catchError(error => {
        console.error('Failed to load intake schema:', error);
        throw error;
      })
    );
  }

  private normalizeSchema(schema: IntakeSchema): IntakeSchema {
    // Normalize and validate the schema
    return {
      ...schema,
      sections: schema.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => this.normalizeField(field))
      }))
    };
  }

  private normalizeField(field: any): any {
    // Ensure required fields have default values
    return {
      ...field,
      required: field.required ?? false,
      type: field.type || 'text'
    };
  }

  getFieldById(fieldId: string): any | null {
    if (!this.schema) return null;
    
    for (const section of this.schema.sections) {
      const field = section.fields.find(f => f.id === fieldId);
      if (field) return field;
      
      // Check repeater fields
      for (const f of section.fields) {
        if (f.type === 'repeater' && f.itemFields) {
          const repeaterField = f.itemFields.find(rf => rf.id === fieldId);
          if (repeaterField) return repeaterField;
        }
      }
    }
    
    return null;
  }

  getSectionById(sectionId: string): any | null {
    if (!this.schema) return null;
    return this.schema.sections.find(s => s.id === sectionId) || null;
  }
}
