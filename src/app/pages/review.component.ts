import { Component } from '@angular/core';
import { ReviewPanelComponent } from '../components/review-panel.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReviewPanelComponent],
  template: `
    <app-review-panel></app-review-panel>
  `
})
export class ReviewComponent {}
