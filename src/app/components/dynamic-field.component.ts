import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { IntakeField } from '../models/intake.models';
import { FileDropzoneComponent } from './file-dropzone.component';
import { PhoneInputComponent } from './phone-input.component';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    FileDropzoneComponent,
    PhoneInputComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="dynamic-field w-full mb-6" [ngClass]="'field-type-' + field.type">
      
      <!-- Text Input -->
      <div *ngIf="field.type === 'text'" class="relative">
        <input 
          type="text" 
          [id]="field.id"
          [formControl]="control"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
          [class.uppercase]="field.id === 'postal_code'"
          [placeholder]="field.placeholder || field.label"
          [attr.title]="field.placeholder ? field.placeholder : ''"
          [attr.maxlength]="field.maxlength"
          (input)="onTextInput($event)"
          (paste)="onTextPaste($event)"
        />
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:text-blue-500 bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="field.placeholder && field.placeholder !== field.label" class="text-xs text-gray-500 mt-1">
          Format: {{ field.placeholder }}
        </div>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Textarea -->
      <div *ngIf="field.type === 'textarea'" class="relative">
        <textarea 
          [id]="field.id"
          [formControl]="control"
          rows="3"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all resize-y"
          [placeholder]="field.label"
        ></textarea>
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Email Input -->
      <div *ngIf="field.type === 'email'" class="relative">
        <input 
          type="email" 
          [id]="field.id"
          [formControl]="control"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
          [placeholder]="field.label"
        />
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Phone Input -->
      <div *ngIf="field.type === 'tel'" class="relative">
        <app-phone-input
          [formControl]="control"
          [label]="field.label"
          [required]="field.required"
          [fieldId]="field.id"
        ></app-phone-input>
      </div>

      <!-- Number Input -->
      <div *ngIf="field.type === 'number'" class="relative">
        <input 
          type="number" 
          [id]="field.id"
          [formControl]="control"
          [attr.min]="field.min" 
          [attr.max]="field.max"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
          [placeholder]="field.label"
        />
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Date Input -->
      <div *ngIf="field.type === 'date'" class="relative">
        <input 
          type="date" 
          [id]="field.id"
          [formControl]="control"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
          [placeholder]="field.label"
        />
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Month Input -->
      <div *ngIf="field.type === 'month'" class="relative">
        <input 
          type="month" 
          [id]="field.id"
          [formControl]="control"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
          [placeholder]="field.label"
        />
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Select Dropdown -->
      <div *ngIf="field.type === 'select'" class="relative">
        <select 
          [id]="field.id"
          [formControl]="control"
          class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all bg-white"
        >
          <option value="">-- Select {{ field.label }} --</option>
          <option *ngFor="let option of field.options" [value]="option">
            {{ option }}
          </option>
        </select>
        <label 
          [for]="field.id" 
          class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
        >
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Multi-select -->
      <div *ngIf="field.type === 'multiselect'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div class="space-y-2 p-3 border border-gray-300 rounded-md bg-gray-50">
          <label *ngFor="let option of field.options" class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              [value]="option"
              [checked]="isOptionSelected(option)"
              (change)="onMultiselectChange(option, $event)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm">{{ option }}</span>
          </label>
        </div>
        <div *ngIf="control.errors" class="text-sm text-red-600">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Radio Buttons -->
      <div *ngIf="field.type === 'radio'" class="space-y-3">
        <label class="block text-sm font-medium text-gray-700">
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div class="space-y-2">
          <label *ngFor="let option of field.options" class="flex items-center space-x-2">
            <input 
              type="radio" 
              [name]="field.id"
              [value]="option"
              [formControl]="control"
              class="text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span class="text-sm">{{ option }}</span>
          </label>
        </div>
        <div *ngIf="control.errors" class="text-sm text-red-600">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Checkbox -->
      <div *ngIf="field.type === 'checkbox'" class="flex items-start space-x-2">
        <input 
          type="checkbox" 
          [id]="field.id"
          [formControl]="control"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
        />
        <label [for]="field.id" class="text-sm text-gray-700">
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Toggle Switch -->
      <div *ngIf="field.type === 'toggle'" class="flex items-center justify-between p-3 border border-gray-300 rounded-md">
        <label class="text-sm font-medium text-gray-700">
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <button
          type="button"
          (click)="toggleSwitch()"
          [class]="control.value ? 'bg-blue-600' : 'bg-gray-200'"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span
            [class]="control.value ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          ></span>
        </button>
        <div *ngIf="control.errors" class="text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- File Upload -->
      <div *ngIf="field.type === 'file'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
        </label>
        <app-file-dropzone
          [formControl]="control"
          [accept]="field.accept || []"
          [multiple]="field.multiple || false"
          [fileMeta]="field.fileMeta || []"
          [maxSizeMB]="25"
        ></app-file-dropzone>
        <div *ngIf="control.errors" class="text-sm text-red-600">
          {{ getErrorMessage() }}
        </div>
      </div>

      <!-- Repeater -->
      <div *ngIf="field.type === 'repeater'" class="space-y-4">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-medium text-gray-700">
            {{ field.label }} <span *ngIf="field.required" class="text-red-500">*</span>
          </label>
          <button 
            type="button"
            (click)="addRepeaterItem()" 
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add {{ getRepeaterItemName() }}
          </button>
        </div>

        <div *ngIf="repeaterItems.length === 0" class="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-md">
          No {{ getRepeaterItemName().toLowerCase() }}s added yet.
        </div>

        <mat-expansion-panel *ngFor="let item of repeaterItems; let i = index" class="mb-3 border border-gray-200 rounded-md">
          <mat-expansion-panel-header class="bg-gray-50">
            <mat-panel-title class="text-sm font-medium">
              {{ getRepeaterItemTitle(item, i) }}
            </mat-panel-title>
            <mat-panel-description>
              <button 
                type="button"
                (click)="removeRepeaterItem(i); $event.stopPropagation();"
                class="text-red-600 hover:text-red-800 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="space-y-4 p-4">
            <app-dynamic-field
              *ngFor="let itemField of field.itemFields"
              [field]="itemField"
              [value]="item[itemField.id]"
              (valueChange)="onRepeaterItemChange(i, itemField.id, $event)"
            ></app-dynamic-field>
          </div>
        </mat-expansion-panel>

        <div *ngIf="control.errors" class="text-sm text-red-600">
          {{ getErrorMessage() }}
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dynamic-field {
      width: 100%;
      display: block;
    }
    
    /* Floating label positioning */
    .floating-label {
      top: -0.5rem;
      z-index: 10;
    }
    
    /* When field is empty and not focused, position label inside */
    input:placeholder-shown + .floating-label,
    textarea:placeholder-shown + .floating-label {
      top: 0.875rem;
      font-size: 0.875rem;
      color: #9ca3af;
      background: transparent;
      padding: 0;
    }
    
    /* When field has value or is focused, keep label elevated */
    input:not(:placeholder-shown) + .floating-label,
    textarea:not(:placeholder-shown) + .floating-label,
    input:focus + .floating-label,
    textarea:focus + .floating-label,
    select:not([value=""]) + .floating-label,
    select:focus + .floating-label {
      top: -0.5rem !important;
      font-size: 0.75rem !important;
      background: white !important;
      padding: 0 0.25rem !important;
      z-index: 10 !important;
    }
    
    /* Focus state color */
    input:focus + .floating-label,
    textarea:focus + .floating-label,
    select:focus + .floating-label {
      color: #3b82f6 !important;
    }
    
    /* Better spacing and typography */
    input, textarea, select {
      font-family: inherit;
      line-height: 1.5;
    }
    
    textarea {
      min-height: 4rem;
      max-height: 8rem;
    }
    
    /* Custom toggle switch styles */
    .toggle-switch {
      transition: all 0.2s ease-in-out;
    }
    
    /* Expansion panel improvements */
    mat-expansion-panel {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
    }
    
    mat-expansion-panel-header {
      height: auto !important;
      padding: 1rem !important;
    }
    
    /* Checkbox and radio improvements */
    input[type="checkbox"], input[type="radio"] {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
    
    /* Postal code formatting */
    .uppercase {
      text-transform: uppercase;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
  `]
})
export class DynamicFieldComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() field!: IntakeField;
  @Input() value: any = null;
  @Output() valueChange = new EventEmitter<any>();

  control = new FormControl();
  repeaterItems: any[] = [];

  private subscription?: Subscription;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.setupFormControl();
    this.initializeRepeaterItems();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
    if (this.field.type === 'repeater') {
      this.repeaterItems = Array.isArray(value) ? value : [];
    } else {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  private setupFormControl(): void {
    this.control.setValue(this.value);
    
    this.subscription = this.control.valueChanges.subscribe(value => {
      this.value = value;
      this.onChange(value);
      this.valueChange.emit(value);
      this.onTouched();
    });
  }

  private initializeRepeaterItems(): void {
    if (this.field.type === 'repeater') {
      this.repeaterItems = Array.isArray(this.value) ? this.value : [];
    }
  }

  // Toggle switch handler
  toggleSwitch(): void {
    this.control.setValue(!this.control.value);
  }

  // Multiselect handlers
  isOptionSelected(option: string): boolean {
    const value = this.control.value || [];
    return Array.isArray(value) && value.includes(option);
  }

  onMultiselectChange(option: string, event: any): void {
    const currentValue = this.control.value || [];
    let newValue: string[];
    
    if (event.target.checked) {
      newValue = [...currentValue, option];
    } else {
      newValue = currentValue.filter((item: string) => item !== option);
    }
    
    this.control.setValue(newValue);
  }

  // Repeater methods
  addRepeaterItem(): void {
    const newItem: any = {};
    if (this.field.itemFields) {
      this.field.itemFields.forEach(field => {
        newItem[field.id] = this.getDefaultValue(field);
      });
    }
    this.repeaterItems.push(newItem);
    this.emitRepeaterValue();
  }

  removeRepeaterItem(index: number): void {
    this.repeaterItems.splice(index, 1);
    this.emitRepeaterValue();
  }

  onRepeaterItemChange(itemIndex: number, fieldId: string, value: any): void {
    this.repeaterItems[itemIndex][fieldId] = value;
    this.emitRepeaterValue();
  }

  private emitRepeaterValue(): void {
    this.value = this.repeaterItems;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.onTouched();
  }

  private getDefaultValue(field: IntakeField): any {
    switch (field.type) {
      case 'checkbox':
      case 'toggle':
        return false;
      case 'multiselect':
        return [];
      case 'repeater':
        return [];
      case 'number':
        return null;
      default:
        return '';
    }
  }

  getRepeaterItemName(): string {
    return this.field.label.includes('Children') ? 'Child' : 'Item';
  }

  getRepeaterItemTitle(item: any, index: number): string {
    if (this.field.itemFields) {
      const nameField = this.field.itemFields.find(f => f.id.includes('name'));
      if (nameField && item[nameField.id]) {
        return item[nameField.id];
      }
      
      const countryField = this.field.itemFields.find(f => f.id.includes('country'));
      if (countryField && item[countryField.id]) {
        return item[countryField.id];
      }
    }
    return `${this.getRepeaterItemName()} ${index + 1}`;
  }

  // Input formatting
  onTextInput(event: any): void {
    if (this.field.id === 'postal_code') {
      const input = event.target;
      const rawValue = input.value;
      const formattedValue = this.formatPostalCodeValue(rawValue);
      
      if (rawValue !== formattedValue) {
        input.value = formattedValue;
        this.control.setValue(formattedValue, { emitEvent: false });
        this.onChange(formattedValue);
        this.valueChange.emit(formattedValue);
      }
    }
  }

  onTextPaste(event: ClipboardEvent): void {
    if (this.field.id === 'postal_code') {
      event.preventDefault();
      const paste = event.clipboardData?.getData('text') || '';
      const formattedValue = this.formatPostalCodeValue(paste);
      
      const input = event.target as HTMLInputElement;
      input.value = formattedValue;
      this.control.setValue(formattedValue, { emitEvent: false });
      this.onChange(formattedValue);
      this.valueChange.emit(formattedValue);
    }
  }

  private formatPostalCodeValue(value: string): string {
    // Remove all non-alphanumeric characters and convert to uppercase
    let clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Filter to build valid Canadian postal code pattern: L#L #L# (Letter-Number-Letter Space Number-Letter-Number)
    let result = '';
    let position = 0;
    
    for (let i = 0; i < clean.length && position < 6; i++) {
      const char = clean[i];
      let isValid = false;
      
      // Check if character is valid for current position
      // Canadian postal code pattern: L#L #L#
      if (position === 0 || position === 2 || position === 4) {
        // Should be a letter (positions 0, 2, 4)
        isValid = /[A-Z]/.test(char);
      } else if (position === 1 || position === 3 || position === 5) {
        // Should be a number (positions 1, 3, 5)
        isValid = /[0-9]/.test(char);
      }
      
      if (isValid) {
        result += char;
        position++;
        
        // Add space after 3rd character if we have more characters
        if (position === 3 && clean.length > i + 1) {
          result += ' ';
        }
      }
      // If not valid, skip this character and continue
    }
    
    return result;
  }

  getErrorMessage(): string {
    if (this.control.errors) {
      if (this.control.errors['required']) {
        return `${this.field.label} is required`;
      }
      if (this.control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (this.control.errors['pattern']) {
        if (this.field.id === 'postal_code') {
          return 'Please enter a valid Canadian postal code (e.g., A1B 2C3)';
        }
        return 'Please enter a valid format';
      }
      if (this.control.errors['min']) {
        return `Value must be at least ${this.field.min}`;
      }
      if (this.control.errors['max']) {
        return `Value must be no more than ${this.field.max}`;
      }
    }
    return 'Invalid input';
  }
}