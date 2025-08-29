import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { IntakeFormValue, AutosaveStatus } from '../models/intake.models';

@Injectable({
  providedIn: 'root'
})
export class IntakeStateService {
  private readonly STORAGE_KEY = 'legal_intake_draft';
  private readonly AUTOSAVE_DELAY = 2000; // 2 seconds

  private formValueSubject = new BehaviorSubject<IntakeFormValue>({});
  private autosaveStatusSubject = new BehaviorSubject<AutosaveStatus>({ status: 'idle' });
  private completionSubject = new BehaviorSubject<number>(0);

  public formValue$ = this.formValueSubject.asObservable();
  public autosaveStatus$ = this.autosaveStatusSubject.asObservable();
  public completion$ = this.completionSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDraft();
      this.setupAutosave();
    }
  }

  patchValue(sectionId: string, fieldId: string, value: any): void {
    const currentValue = this.formValueSubject.value;
    const updatedValue = {
      ...currentValue,
      [sectionId]: {
        ...currentValue[sectionId],
        [fieldId]: value
      }
    };
    
    this.formValueSubject.next(updatedValue);
    this.updateCompletion();
  }

  getValue(sectionId: string, fieldId: string): any {
    const section = this.formValueSubject.value[sectionId];
    return section ? section[fieldId] : undefined;
  }

  getSectionValue(sectionId: string): any {
    return this.formValueSubject.value[sectionId] || {};
  }

  getAllValues(): IntakeFormValue {
    return this.formValueSubject.value;
  }

  resetForm(): void {
    this.formValueSubject.next({});
    this.clearDraft();
    this.updateCompletion();
  }

  private setupAutosave(): void {
    this.formValue$
      .pipe(debounce(() => timer(this.AUTOSAVE_DELAY)))
      .subscribe(value => {
        this.saveDraft(value);
      });
  }

  private saveDraft(value: IntakeFormValue): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      this.autosaveStatusSubject.next({ status: 'saving' });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        value,
        timestamp: new Date().toISOString()
      }));
      this.autosaveStatusSubject.next({ 
        status: 'saved', 
        lastSaved: new Date() 
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      this.autosaveStatusSubject.next({ 
        status: 'error', 
        error: 'Failed to save draft' 
      });
    }
  }

  private loadDraft(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const { value } = JSON.parse(stored);
        this.formValueSubject.next(value || {});
        this.updateCompletion();
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      this.clearDraft();
    }
  }

  clearDraft(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  hasDraft(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    
    try {
      return !!localStorage.getItem(this.STORAGE_KEY);
    } catch {
      return false;
    }
  }

  private updateCompletion(): void {
    // This would calculate completion percentage based on filled required fields
    // For now, a simple implementation
    const values = this.formValueSubject.value;
    const totalSections = Object.keys(values).length;
    const filledSections = Object.values(values).filter(section => 
      Object.values(section || {}).some(value => 
        value !== null && value !== undefined && value !== ''
      )
    ).length;
    
    const completion = totalSections > 0 ? (filledSections / totalSections) * 100 : 0;
    this.completionSubject.next(Math.min(completion, 100));
  }

  calculateSectionCompletion(sectionId: string, requiredFields: string[]): number {
    const sectionValues = this.getSectionValue(sectionId);
    const filledRequired = requiredFields.filter(fieldId => {
      const value = sectionValues[fieldId];
      return value !== null && value !== undefined && value !== '';
    }).length;
    
    return requiredFields.length > 0 ? (filledRequired / requiredFields.length) * 100 : 100;
  }
}
