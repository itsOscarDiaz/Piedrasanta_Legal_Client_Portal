import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { SchemaLoaderService } from '../services/schema-loader.service';
import { IntakeStateService } from '../services/intake-state.service';
import { IntakeSchema, IntakeSection, IntakeField, IntakeFormValue } from '../models/intake.models';

@Component({
  selector: 'app-review-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule
  ],
  template: `
    <div class="review-panel max-w-4xl mx-auto p-6 print:p-0">
      
      <!-- Header -->
      <div class="mb-8 print:mb-4">
        <h1 class="text-3xl font-bold text-gray-900 print:text-2xl">Review Your Information</h1>
        <p class="text-gray-600 mt-2 print:text-sm">
          Please review your information carefully before submitting. You can edit any section by clicking the edit button.
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="!schema" class="text-center py-12">
        <p class="text-gray-600">Loading your information...</p>
      </div>

      <!-- Review Sections -->
      <div *ngIf="schema" class="space-y-6 mb-8">
        
        <mat-expansion-panel 
          *ngFor="let section of schema.sections" 
          [expanded]="true"
          class="review-section print:shadow-none print:border"
        >
          <mat-expansion-panel-header class="print:hidden">
            <mat-panel-title>
              <div class="flex items-center space-x-2">
                <span class="font-medium">{{ section.title }}</span>
                <mat-icon 
                  *ngIf="isSectionComplete(section)" 
                  class="text-green-500"
                >
                  check_circle
                </mat-icon>
                <mat-icon 
                  *ngIf="!isSectionComplete(section)" 
                  class="text-orange-500"
                >
                  warning
                </mat-icon>
              </div>
            </mat-panel-title>
            <mat-panel-description>
              <button 
                mat-button 
                color="primary"
                (click)="editSection(section.id); $event.stopPropagation();"
                class="print:hidden"
              >
                <mat-icon>edit</mat-icon>
                Edit
              </button>
            </mat-panel-description>
          </mat-expansion-panel-header>

          <!-- Print Header (only visible when printing) -->
          <div class="hidden print:block print:mb-4">
            <h2 class="text-xl font-semibold border-b pb-2">{{ section.title }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1">
            <div 
              *ngFor="let field of getCompletedFields(section)" 
              class="review-field"
            >
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">
                  {{ field.label }}
                </label>
                <div class="text-gray-900">
                  {{ formatFieldValue(section.id, field) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Show incomplete fields notice -->
          <div 
            *ngIf="getIncompleteFields(section).length > 0" 
            class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md print:hidden"
          >
            <div class="flex items-start space-x-2">
              <mat-icon class="text-orange-500 mt-0.5">warning</mat-icon>
              <div>
                <h4 class="font-medium text-orange-800">Incomplete Fields</h4>
                <p class="text-orange-700 text-sm">
                  The following required fields are not completed:
                </p>
                <ul class="text-orange-700 text-sm mt-1 list-disc list-inside">
                  <li *ngFor="let field of getIncompleteFields(section)">
                    {{ field.label }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </mat-expansion-panel>

      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-6 border-t print:hidden">
        <button 
          mat-button 
          (click)="goBack()"
          class="flex items-center space-x-2"
        >
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Form</span>
        </button>

        <div class="flex space-x-4">
          <button 
            mat-button 
            (click)="printForm()"
            class="flex items-center space-x-2"
          >
            <mat-icon>print</mat-icon>
            <span>Print</span>
          </button>

          <button 
            mat-raised-button 
            color="primary"
            (click)="submitForm()"
            [disabled]="!isFormComplete()"
            class="flex items-center space-x-2"
          >
            <mat-icon>send</mat-icon>
            <span>Submit Application</span>
          </button>
        </div>
      </div>

      <!-- E-signature Placeholder (for print) -->
      <div class="hidden print:block mt-8 pt-6 border-t">
        <h3 class="text-lg font-semibold mb-4">Signature</h3>
        <div class="grid grid-cols-2 gap-8">
          <div>
            <div class="border-b border-gray-400 pb-1 mb-2">
              <p class="text-sm text-gray-600">Client Signature</p>
            </div>
            <div class="h-12"></div>
            <div class="border-b border-gray-400 pb-1">
              <p class="text-sm text-gray-600">Date</p>
            </div>
          </div>
          <div>
            <div class="border-b border-gray-400 pb-1 mb-2">
              <p class="text-sm text-gray-600">Legal Representative Signature</p>
            </div>
            <div class="h-12"></div>
            <div class="border-b border-gray-400 pb-1">
              <p class="text-sm text-gray-600">Date</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .review-panel {
      background: white;
      min-height: 100vh;
    }

    .review-field {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: #f9fafb;
    }

    .review-section {
      margin-bottom: 1rem;
    }

    @media print {
      .review-panel {
        margin: 0;
        padding: 1rem;
        background: white;
        box-shadow: none;
      }

      .review-section {
        break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #e5e7eb !important;
        margin-bottom: 1rem;
      }

      .review-field {
        break-inside: avoid;
        border: none;
        background: white;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
      }

      h1 {
        color: black !important;
      }

      h2, h3 {
        color: black !important;
      }

      .text-gray-900 {
        color: black !important;
      }

      .text-gray-700 {
        color: #374151 !important;
      }
    }
  `]
})
export class ReviewPanelComponent implements OnInit {
  schema: IntakeSchema | null = null;
  formData: IntakeFormValue = {};

  constructor(
    private schemaLoader: SchemaLoaderService,
    private intakeState: IntakeStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.schemaLoader.loadSchema().subscribe({
      next: (schema) => {
        this.schema = schema;
        this.formData = this.intakeState.getAllValues();
      },
      error: (error) => {
        console.error('Error loading schema:', error);
        this.router.navigate(['/intake']);
      }
    });
  }

  getCompletedFields(section: IntakeSection): IntakeField[] {
    return section.fields.filter(field => {
      const value = this.getFieldValue(section.id, field.id);
      return this.hasValue(value) && this.isFieldVisible(section.id, field);
    });
  }

  getIncompleteFields(section: IntakeSection): IntakeField[] {
    return section.fields.filter(field => {
      const value = this.getFieldValue(section.id, field.id);
      return field.required && !this.hasValue(value) && this.isFieldVisible(section.id, field);
    });
  }

  private isFieldVisible(sectionId: string, field: IntakeField): boolean {
    if (!field.visibleIf) return true;

    for (const [checkFieldId, expectedValue] of Object.entries(field.visibleIf)) {
      const actualValue = this.getFieldValue(sectionId, checkFieldId);
      if (Array.isArray(expectedValue)) {
        if (!expectedValue.includes(actualValue)) return false;
      } else {
        if (actualValue !== expectedValue) return false;
      }
    }

    return true;
  }

  private getFieldValue(sectionId: string, fieldId: string): any {
    return this.formData[sectionId]?.[fieldId];
  }

  private hasValue(value: any): boolean {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }

  formatFieldValue(sectionId: string, field: IntakeField): string {
    const value = this.getFieldValue(sectionId, field.id);
    
    if (!this.hasValue(value)) {
      return 'Not provided';
    }

    switch (field.type) {
      case 'checkbox':
      case 'toggle':
        return value ? 'Yes' : 'No';
      
      case 'multiselect':
        return Array.isArray(value) ? value.join(', ') : value;
      
      case 'file':
        if (Array.isArray(value)) {
          return value.map(file => file.filename || 'Uploaded file').join(', ');
        } else if (value && value.filename) {
          return value.filename;
        }
        return 'File uploaded';
      
      case 'repeater':
        if (Array.isArray(value)) {
          return value.map((item, index) => {
            const itemFields = field.itemFields || [];
            const firstField = itemFields[0];
            const itemValue = firstField ? item[firstField.id] : '';
            return `${index + 1}. ${itemValue}`;
          }).join('; ');
        }
        return value;
      
      case 'date':
        if (value) {
          return new Date(value).toLocaleDateString();
        }
        return value;
      
      case 'month':
        return value; // Already in YYYY-MM format
      
      default:
        return String(value);
    }
  }

  isSectionComplete(section: IntakeSection): boolean {
    const incompleteFields = this.getIncompleteFields(section);
    return incompleteFields.length === 0;
  }

  isFormComplete(): boolean {
    if (!this.schema) return false;
    
    return this.schema.sections.every(section => this.isSectionComplete(section));
  }

  editSection(sectionId: string): void {
    this.router.navigate(['/intake'], { 
      queryParams: { section: sectionId }
    });
  }

  goBack(): void {
    this.router.navigate(['/intake']);
  }

  printForm(): void {
    window.print();
  }

  submitForm(): void {
    if (!this.isFormComplete()) {
      // Show error message
      console.warn('Form is not complete');
      return;
    }

    // Here you would typically send the data to a backend service
    // For now, we'll simulate a successful submission
    console.log('Submitting form data:', this.formData);
    
    // Clear the draft since form is being submitted
    this.intakeState.clearDraft();
    
    // Navigate to success page
    this.router.navigate(['/success']);
  }
}
