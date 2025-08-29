import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SchemaLoaderService } from '../services/schema-loader.service';
import { IntakeStateService } from '../services/intake-state.service';
import { ValidationService } from '../services/validation.service';
import { IntakeSchema, IntakeSection, IntakeField } from '../models/intake.models';
import { DynamicFieldComponent } from './dynamic-field.component';
import { AutosaveIndicatorComponent } from './autosave-indicator.component';

@Component({
  selector: 'app-intake-stepper',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    DynamicFieldComponent,
    AutosaveIndicatorComponent
  ],
  template: `
    <div class="intake-stepper-container max-w-6xl mx-auto p-4">
      
      <!-- Header -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ schema?.title }}</h1>
            <p class="text-gray-600 mt-1">{{ schema?.description }}</p>
          </div>
          <app-autosave-indicator></app-autosave-indicator>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-4" *ngIf="schema?.ui?.progress">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {{ (completion$ | async) | number:'1.0-0' }}%</span>
            <span>Step {{ selectedIndex + 1 }} of {{ schema?.sections?.length }}</span>
          </div>
          <mat-progress-bar 
            [value]="completion$ | async" 
            mode="determinate"
            class="h-2 rounded"
          ></mat-progress-bar>
        </div>
      </div>

      <!-- Draft Resume Banner -->
      <div 
        *ngIf="hasDraft && !draftResumed" 
        class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-blue-800 font-medium">Resume Previous Session</h3>
            <p class="text-blue-600 text-sm">We found a saved draft of your intake form.</p>
          </div>
          <div class="space-x-2">
            <button mat-button (click)="dismissDraft()">Start Fresh</button>
            <button mat-raised-button color="primary" (click)="resumeDraft()">Resume</button>
          </div>
        </div>
      </div>

      <!-- Stepper -->
      <mat-stepper 
        #stepper 
        [selectedIndex]="selectedIndex"
        (selectionChange)="onStepChange($event)"
        orientation="vertical"
        [linear]="false"
        class="intake-stepper"
        *ngIf="schema"
      >
        
        <mat-step 
          *ngFor="let section of schema.sections; let i = index"
          [stepControl]="sectionForms[section.id]"
          [label]="section.title"
          [editable]="true"
        >
          <ng-template matStepLabel>
            <div class="flex items-center space-x-2">
              <span>{{ section.title }}</span>
              <mat-icon 
                *ngIf="getSectionCompletion(section.id) === 100" 
                class="text-green-500 text-sm"
              >
                check_circle
              </mat-icon>
            </div>
          </ng-template>

          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>{{ section.title }}</mat-card-title>
            </mat-card-header>
            
            <mat-card-content class="pt-4">
              <form [formGroup]="sectionForms[section.id]" class="form-container">
                
                <div *ngFor="let field of getVisibleFields(section)" class="field-wrapper">
                  <app-dynamic-field
                    [field]="field"
                    [value]="getFieldValue(section.id, field.id)"
                    (valueChange)="onFieldChange(section.id, field.id, $event)"
                  ></app-dynamic-field>
                </div>
                
              </form>
            </mat-card-content>

            <mat-card-actions class="flex justify-between mt-6">
              <button 
                mat-button 
                (click)="stepper.previous()"
                [disabled]="i === 0"
              >
                <mat-icon>arrow_back</mat-icon>
                Previous
              </button>

              <div class="flex space-x-2">
                <button 
                  mat-button 
                  (click)="validateAndContinue(section.id)"
                  *ngIf="i < schema.sections.length - 1"
                >
                  Continue
                  <mat-icon>arrow_forward</mat-icon>
                </button>

                <button 
                  mat-raised-button 
                  color="primary"
                  (click)="goToReview()"
                  *ngIf="i === schema.sections.length - 1"
                >
                  Review & Submit
                  <mat-icon>visibility</mat-icon>
                </button>
              </div>
            </mat-card-actions>
          </mat-card>

        </mat-step>

      </mat-stepper>

      <!-- Loading State -->
      <div *ngIf="!schema" class="text-center py-12">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p class="text-gray-600 mt-4">Loading intake form...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="text-center py-12">
        <mat-icon class="text-red-500 text-6xl mb-4">error</mat-icon>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Error Loading Form</h3>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <button mat-raised-button color="primary" (click)="loadSchema()">
          Try Again
        </button>
      </div>

    </div>
  `,
  styles: [`
    .intake-stepper-container {
      min-height: 100vh;
      background-color: #f9fafb;
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .intake-stepper {
      background: transparent;
    }

    .section-card {
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }
    
    .field-wrapper {
      width: 100%;
      display: block;
      margin-bottom: 1.5rem;
    }
    
    .field-container {
      margin-bottom: 2rem;
      padding: 0 8px;
    }

    /* Improved form spacing and layout */
    .section-card .mat-mdc-card-content {
      padding: 2rem !important;
      max-width: none !important;
    }

    /* Better responsive design */
    @media (max-width: 768px) {
      .section-card .mat-mdc-card-content {
        padding: 1rem !important;
      }
      
      .field-container {
        margin-bottom: 1.5rem;
        padding: 0 4px;
      }
    }

    /* Professional stepper styling */
    ::ng-deep .mat-stepper-vertical-line::before {
      border-left-color: #e5e7eb;
      border-left-width: 2px;
    }

    ::ng-deep .mat-step-header {
      padding: 16px 24px !important;
      min-height: 60px !important;
    }

    ::ng-deep .mat-step-header .mat-step-icon {
      background-color: #6b7280;
      width: 28px !important;
      height: 28px !important;
      font-size: 14px !important;
    }

    ::ng-deep .mat-step-header .mat-step-icon-selected {
      background-color: #3b82f6;
    }

    ::ng-deep .mat-step-header .mat-step-icon-state-done {
      background-color: #10b981;
    }

    ::ng-deep .mat-step-header .mat-step-label {
      font-weight: 500 !important;
      color: #374151 !important;
    }

    ::ng-deep .mat-step-header.cdk-program-focused {
      background-color: rgba(59, 130, 246, 0.05) !important;
    }

    /* Better form field spacing */
    ::ng-deep .dynamic-field .mat-mdc-form-field {
      margin-bottom: 0.5rem !important;
    }

    /* Improved button styling */
    .mat-mdc-card-actions {
      padding: 1.5rem 2rem !important;
      background-color: #f9fafb !important;
      border-top: 1px solid #e5e7eb !important;
    }

    @media (max-width: 768px) {
      .mat-mdc-card-actions {
        padding: 1rem !important;
        flex-direction: column !important;
        align-items: stretch !important;
      }
      
      .mat-mdc-card-actions button {
        margin-bottom: 0.5rem !important;
      }
    }
  `]
})
export class IntakeStepperComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  schema: IntakeSchema | null = null;
  sectionForms: { [sectionId: string]: FormGroup } = {};
  selectedIndex = 0;
  hasDraft = false;
  draftResumed = false;
  errorMessage = '';

  completion$: Observable<number>;

  private subscriptions: Subscription[] = [];

  constructor(
    private schemaLoader: SchemaLoaderService,
    private intakeState: IntakeStateService,
    private validation: ValidationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.completion$ = this.intakeState.completion$;
  }

  ngOnInit(): void {
    this.hasDraft = this.intakeState.hasDraft();
    this.loadSchema();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadSchema(): void {
    this.errorMessage = '';
    
    const schemaSub = this.schemaLoader.loadSchema().subscribe({
      next: (schema) => {
        this.schema = schema;
        this.initializeForms();
      },
      error: (error) => {
        console.error('Error loading schema:', error);
        this.errorMessage = 'Failed to load the intake form. Please try refreshing the page.';
      }
    });

    this.subscriptions.push(schemaSub);
  }

  private initializeForms(): void {
    if (!this.schema) return;

    // Create form groups for each section
    this.schema.sections.forEach(section => {
      const formGroup = this.formBuilder.group({});
      
      section.fields.forEach(field => {
        const currentValue = this.intakeState.getValue(section.id, field.id);
        formGroup.addControl(field.id, this.formBuilder.control(currentValue));
      });

      this.sectionForms[section.id] = formGroup;
    });
  }

  getVisibleFields(section: IntakeSection): IntakeField[] {
    return section.fields.filter(field => this.isFieldVisible(section.id, field));
  }

  private isFieldVisible(sectionId: string, field: IntakeField): boolean {
    if (!field.visibleIf) return true;

    for (const [checkFieldId, expectedValue] of Object.entries(field.visibleIf)) {
      const actualValue = this.intakeState.getValue(sectionId, checkFieldId);
      if (Array.isArray(expectedValue)) {
        if (!expectedValue.includes(actualValue)) return false;
      } else {
        if (actualValue !== expectedValue) return false;
      }
    }

    return true;
  }

  getFieldValue(sectionId: string, fieldId: string): any {
    return this.intakeState.getValue(sectionId, fieldId);
  }

  onFieldChange(sectionId: string, fieldId: string, value: any): void {
    this.intakeState.patchValue(sectionId, fieldId, value);
    
    // Update form control
    const form = this.sectionForms[sectionId];
    if (form && form.get(fieldId)) {
      form.get(fieldId)!.setValue(value, { emitEvent: false });
    }

    // Check for field reveals
    this.handleFieldReveals(sectionId, fieldId, value);
  }

  private handleFieldReveals(sectionId: string, fieldId: string, value: any): void {
    if (!this.schema) return;

    const section = this.schema.sections.find(s => s.id === sectionId);
    if (!section) return;

    const field = section.fields.find(f => f.id === fieldId);
    if (!field || !field.reveals) return;

    const revealsKey = Array.isArray(value) ? value.find(v => field.reveals![v]) : value;
    const fieldsToReveal = field.reveals[revealsKey] || [];

    // Clear values for fields that should no longer be visible
    Object.keys(field.reveals).forEach(key => {
      if (key !== revealsKey) {
        const fieldsToHide = field.reveals![key] || [];
        fieldsToHide.forEach(hideFieldId => {
          this.intakeState.patchValue(sectionId, hideFieldId, null);
        });
      }
    });
  }

  onStepChange(event: any): void {
    this.selectedIndex = event.selectedIndex;
  }

  validateAndContinue(sectionId: string): void {
    if (this.validateSection(sectionId)) {
      this.stepper.next();
    }
  }

  private validateSection(sectionId: string): boolean {
    if (!this.schema) return false;

    const section = this.schema.sections.find(s => s.id === sectionId);
    if (!section) return false;

    const sectionValues = this.intakeState.getSectionValue(sectionId);
    const visibleFields = this.getVisibleFields(section);
    
    const result = this.validation.validateSection(visibleFields, sectionValues, sectionId);
    
    if (!result.valid) {
      // Mark form fields as touched to show errors
      const form = this.sectionForms[sectionId];
      if (form) {
        form.markAllAsTouched();
      }
      
      // You could show a toast/snackbar here with validation errors
      console.warn('Validation errors:', result.errors);
      return false;
    }

    return true;
  }

  getSectionCompletion(sectionId: string): number {
    if (!this.schema) return 0;

    const section = this.schema.sections.find(s => s.id === sectionId);
    if (!section) return 0;

    const requiredFields = section.fields
      .filter(field => field.required && this.isFieldVisible(sectionId, field))
      .map(field => field.id);

    return this.intakeState.calculateSectionCompletion(sectionId, requiredFields);
  }

  resumeDraft(): void {
    this.draftResumed = true;
    // Data is already loaded by IntakeStateService
  }

  dismissDraft(): void {
    this.intakeState.clearDraft();
    this.intakeState.resetForm();
    this.hasDraft = false;
    this.draftResumed = false;
    this.initializeForms();
  }

  goToReview(): void {
    // Validate all sections before going to review
    let allValid = true;
    
    if (this.schema) {
      for (const section of this.schema.sections) {
        if (!this.validateSection(section.id)) {
          allValid = false;
          break;
        }
      }
    }

    if (allValid) {
      this.router.navigate(['/intake/review']);
    } else {
      // Show error message or highlight invalid sections
      console.warn('Please complete all required fields before reviewing');
    }
  }
}
