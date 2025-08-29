import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="success-page min-h-screen bg-gray-50 flex items-center justify-center p-4">
      
      <mat-card class="max-w-2xl w-full text-center">
        <mat-card-content class="py-12">
          
          <!-- Success Icon -->
          <div class="mb-8">
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-green-600 text-5xl">check_circle</mat-icon>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Application Submitted Successfully!
            </h1>
            <p class="text-gray-600 text-lg">
              Thank you for completing your legal services intake form.
            </p>
          </div>

          <!-- Confirmation Details -->
          <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <mat-icon class="text-blue-600 mt-1">email</mat-icon>
                <div>
                  <h3 class="font-medium text-gray-900">Confirmation Email</h3>
                  <p class="text-gray-600 text-sm">
                    You will receive a confirmation email with your submission details 
                    within the next few minutes.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <mat-icon class="text-blue-600 mt-1">schedule</mat-icon>
                <div>
                  <h3 class="font-medium text-gray-900">Initial Review</h3>
                  <p class="text-gray-600 text-sm">
                    Our legal team will review your application within 2-3 business days 
                    and assess your case requirements.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <mat-icon class="text-blue-600 mt-1">phone</mat-icon>
                <div>
                  <h3 class="font-medium text-gray-900">Follow-up Contact</h3>
                  <p class="text-gray-600 text-sm">
                    We will contact you via your preferred method to discuss next steps, 
                    schedule a consultation, or request additional information.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <mat-icon class="text-blue-600 mt-1">description</mat-icon>
                <div>
                  <h3 class="font-medium text-gray-900">Document Preparation</h3>
                  <p class="text-gray-600 text-sm">
                    If additional documentation is needed, we will provide you with 
                    a detailed list and guidance on how to obtain required documents.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reference Number -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 class="font-semibold text-blue-900 mb-2">Reference Number</h3>
            <div class="text-2xl font-mono text-blue-800 tracking-wider">
              {{ referenceNumber }}
            </div>
            <p class="text-blue-700 text-sm mt-2">
              Please save this number for your records. You may need it for future correspondence.
            </p>
          </div>

          <!-- Important Notes -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <div class="flex items-start space-x-3">
              <mat-icon class="text-yellow-600 mt-1">info</mat-icon>
              <div>
                <h3 class="font-medium text-yellow-900 mb-2">Important Notes</h3>
                <ul class="text-yellow-800 text-sm space-y-1 list-disc list-inside">
                  <li>Keep all original documents safe and readily available</li>
                  <li>Monitor your email (including spam/junk folders) for updates</li>
                  <li>Respond promptly to any requests for additional information</li>
                  <li>Note any upcoming deadlines mentioned in your case details</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              mat-raised-button 
              color="primary"
              (click)="printConfirmation()"
              class="flex items-center justify-center space-x-2"
            >
              <mat-icon>print</mat-icon>
              <span>Print Confirmation</span>
            </button>

            <button 
              mat-button 
              [routerLink]="['/']"
              class="flex items-center justify-center space-x-2"
            >
              <mat-icon>home</mat-icon>
              <span>Return to Home</span>
            </button>
          </div>

        </mat-card-content>
      </mat-card>

    </div>

    <!-- Print-only content -->
    <div class="hidden print:block print-content">
      <div class="max-w-2xl mx-auto p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold mb-4">Legal Services Intake - Confirmation</h1>
          <p class="text-gray-600">Application submitted successfully</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div>
            <strong>Reference Number:</strong><br>
            {{ referenceNumber }}
          </div>
          <div>
            <strong>Submission Date:</strong><br>
            {{ submissionDate | date:'medium' }}
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-4">Next Steps:</h2>
          <ol class="list-decimal list-inside space-y-2 text-sm">
            <li>Watch for confirmation email within the next few minutes</li>
            <li>Our legal team will review your application within 2-3 business days</li>
            <li>We will contact you to discuss next steps and schedule consultation</li>
            <li>Prepare any additional documentation that may be requested</li>
          </ol>
        </div>

        <div class="border-t pt-4 text-sm text-gray-600">
          <p>Please keep this confirmation for your records.</p>
          <p>For questions, reference this confirmation number in all correspondence.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0);
      background-size: 20px 20px;
    }

    @media print {
      .success-page {
        display: none;
      }
      
      .print-content {
        display: block !important;
      }
    }
  `]
})
export class SuccessComponent implements OnInit {
  referenceNumber = '';
  submissionDate = new Date();

  ngOnInit(): void {
    this.generateReferenceNumber();
  }

  private generateReferenceNumber(): void {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.referenceNumber = `LS-${timestamp}-${random}`;
  }

  printConfirmation(): void {
    window.print();
  }
}
