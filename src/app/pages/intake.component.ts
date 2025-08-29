import { Component } from '@angular/core';
import { IntakeStepperComponent } from '../components/intake-stepper.component';

@Component({
  selector: 'app-intake',
  standalone: true,
  imports: [IntakeStepperComponent],
  template: `
    <app-intake-stepper></app-intake-stepper>
  `
})
export class IntakeComponent {}
