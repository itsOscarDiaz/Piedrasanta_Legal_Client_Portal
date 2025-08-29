import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IntakeStateService } from '../services/intake-state.service';
import { AutosaveStatus } from '../models/intake.models';

@Component({
  selector: 'app-autosave-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-2 text-sm" [ngClass]="getStatusClass()">
      <div class="flex items-center space-x-1">
        <div 
          class="w-2 h-2 rounded-full" 
          [ngClass]="{
            'bg-green-500': status.status === 'saved',
            'bg-yellow-500': status.status === 'saving',
            'bg-red-500': status.status === 'error',
            'bg-gray-400': status.status === 'idle'
          }"
        ></div>
        <span>{{ getStatusText() }}</span>
      </div>
      <span 
        *ngIf="status.lastSaved" 
        class="text-gray-500 text-xs"
      >
        Last saved: {{ formatTime(status.lastSaved) }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AutosaveIndicatorComponent implements OnInit, OnDestroy {
  status: AutosaveStatus = { status: 'idle' };
  private subscription?: Subscription;

  constructor(private intakeStateService: IntakeStateService) {}

  ngOnInit(): void {
    this.subscription = this.intakeStateService.autosaveStatus$.subscribe(
      status => this.status = status
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getStatusText(): string {
    switch (this.status.status) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Saved';
      case 'error': return 'Error saving';
      default: return '';
    }
  }

  getStatusClass(): string {
    switch (this.status.status) {
      case 'saved': return 'text-green-600';
      case 'saving': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }
}
