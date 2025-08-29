import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidationResult, ValidationError, IntakeField } from '../models/intake.models';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() {}

  // Email validation
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { email: true };
    };
  }

  // Phone validation
  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const phoneRegex = /^\+?[0-9\-\(\)\s]{7,}$/;
      return phoneRegex.test(control.value) ? null : { phone: true };
    };
  }

  // Date validation - ensure date is not in the past (for expiry dates)
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return inputDate >= today ? null : { futureDate: true };
    };
  }

  // Custom pattern validator
  patternValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const regex = new RegExp(pattern);
      return regex.test(control.value) ? null : { pattern: true };
    };
  }

  // File validation
  fileValidator(accept: string[], maxSizeMB: number = 25): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const files = Array.isArray(control.value) ? control.value : [control.value];
      
      for (const file of files) {
        if (!(file instanceof File)) continue;
        
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          return { fileSize: { max: maxSizeMB, actual: Math.round(file.size / 1024 / 1024) } };
        }
        
        // Check file type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!accept.includes(fileExtension)) {
          return { fileType: { accepted: accept, actual: fileExtension } };
        }
      }
      
      return null;
    };
  }

  // Validate field based on schema
  validateField(field: IntakeField, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    
    // Required validation
    if (field.required && this.isEmpty(value)) {
      errors.push({
        fieldId: field.id,
        sectionId: '', // Will be set by caller
        message: `${field.label} is required`
      });
    }
    
    if (this.isEmpty(value)) {
      return { valid: errors.length === 0, errors };
    }
    
    // Type-specific validation
    switch (field.type) {
      case 'email':
        if (!this.isValidEmail(value)) {
          errors.push({
            fieldId: field.id,
            sectionId: '',
            message: 'Please enter a valid email address'
          });
        }
        break;
        
      case 'tel':
        if (!this.isValidPhone(value)) {
          errors.push({
            fieldId: field.id,
            sectionId: '',
            message: 'Please enter a valid phone number'
          });
        }
        break;
        
      case 'date':
        if (field.minDate === 'today' && !this.isFutureDate(value)) {
          errors.push({
            fieldId: field.id,
            sectionId: '',
            message: 'Date must be in the future'
          });
        }
        break;
        
      case 'number':
        if (field.min !== undefined && value < field.min) {
          errors.push({
            fieldId: field.id,
            sectionId: '',
            message: `Value must be at least ${field.min}`
          });
        }
        if (field.max !== undefined && value > field.max) {
          errors.push({
            fieldId: field.id,
            sectionId: '',
            message: `Value must be no more than ${field.max}`
          });
        }
        break;
    }
    
    // Pattern validation
    if (field.pattern && !new RegExp(field.pattern).test(value)) {
      errors.push({
        fieldId: field.id,
        sectionId: '',
        message: 'Please enter a valid format'
      });
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Helper methods
  private isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9\-\(\)\s]{7,}$/;
    return phoneRegex.test(phone);
  }

  private isFutureDate(dateString: string): boolean {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }

  // Validate entire form section
  validateSection(sectionFields: IntakeField[], sectionValues: any, sectionId: string): ValidationResult {
    const allErrors: ValidationError[] = [];
    
    for (const field of sectionFields) {
      const fieldValue = sectionValues[field.id];
      const fieldResult = this.validateField(field, fieldValue);
      
      // Add section ID to errors
      const errorsWithSection = fieldResult.errors.map(error => ({
        ...error,
        sectionId
      }));
      
      allErrors.push(...errorsWithSection);
    }
    
    return { valid: allErrors.length === 0, errors: allErrors };
  }

  // Get validation error message
  getValidationMessage(error: ValidationError): string {
    return error.message;
  }
}
