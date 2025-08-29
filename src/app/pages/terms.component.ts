import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="terms-page min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p class="text-gray-600">
            Last updated: {{ lastUpdated | date:'longDate' }}
          </p>
        </div>

        <mat-card class="mb-8">
          <mat-card-content class="prose max-w-none p-8">
            
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p class="text-gray-700 mb-4">
                By accessing and using this Legal Services Portal ("the Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p class="text-gray-700 mb-4">
                The Legal Services Portal provides an online intake system for legal services including:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Immigration law assistance</li>
                <li>Civil litigation support</li>
                <li>Criminal law representation</li>
                <li>Labour and employment matters</li>
                <li>WSIB claims and appeals</li>
                <li>Translation and interpretation services</li>
                <li>Document preparation and review</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">3. Attorney-Client Relationship</h2>
              <p class="text-gray-700 mb-4">
                <strong>Important:</strong> Completion of the intake form does not automatically establish an 
                attorney-client relationship. An attorney-client relationship is only established when:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>A formal retainer agreement is signed</li>
                <li>Legal fees are paid or arranged</li>
                <li>We formally confirm acceptance of your case</li>
                <li>Written confirmation of representation is provided</li>
              </ul>
              <p class="text-gray-700 mb-4">
                Until such relationship is established, no attorney-client privilege exists, and we assume 
                no responsibility for your legal matter.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">4. Information Accuracy</h2>
              <p class="text-gray-700 mb-4">
                You agree to provide accurate, current, and complete information in your intake submission. 
                You are responsible for:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Ensuring all information provided is truthful and accurate</li>
                <li>Updating us promptly of any changes to your circumstances</li>
                <li>Providing all relevant documents and evidence</li>
                <li>Disclosing any potential conflicts of interest</li>
                <li>Informing us of any deadlines or time-sensitive matters</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">5. Confidentiality</h2>
              <p class="text-gray-700 mb-4">
                We treat all information provided through this portal as confidential, subject to:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Legal and ethical obligations of the legal profession</li>
                <li>Court orders or legal requirements for disclosure</li>
                <li>Your consent to share information</li>
                <li>Necessary consultation with other legal professionals</li>
              </ul>
              <p class="text-gray-700 mb-4">
                However, please note that until an attorney-client relationship is established, 
                communications may not be protected by attorney-client privilege.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">6. Limitations of Service</h2>
              <p class="text-gray-700 mb-4">
                This intake portal is designed for initial case assessment only. It does not:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide legal advice or recommendations</li>
                <li>Create any legal obligations or deadlines</li>
                <li>Guarantee acceptance of your case</li>
                <li>Replace the need for in-person consultation</li>
                <li>Constitute legal representation</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">7. Technical Requirements</h2>
              <p class="text-gray-700 mb-4">
                To use this service effectively, you need:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>A modern web browser with JavaScript enabled</li>
                <li>Stable internet connection</li>
                <li>Ability to upload documents (PDF, Word, images)</li>
                <li>Valid email address for communications</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">8. Prohibited Uses</h2>
              <p class="text-gray-700 mb-4">
                You may not use this service to:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Submit false or misleading information</li>
                <li>Upload malicious files or harmful content</li>
                <li>Attempt to access unauthorized areas</li>
                <li>Share your access credentials with others</li>
                <li>Use the service for unlawful purposes</li>
                <li>Interfere with the service's operation</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p class="text-gray-700 mb-4">
                All content, features, and functionality of this portal are owned by the legal practice 
                and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p class="text-gray-700 mb-4">
                You retain ownership of any documents or information you submit, but grant us permission 
                to use such information for the purpose of providing legal services.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p class="text-gray-700 mb-4">
                This service is provided "as is" without any warranties, express or implied. We do not warrant:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Uninterrupted service availability</li>
                <li>Error-free operation</li>
                <li>Security of transmitted data</li>
                <li>Compatibility with all devices or browsers</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p class="text-gray-700 mb-4">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including without limitation, loss of profits, 
                data, use, goodwill, or other intangible losses resulting from your use of this service.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p class="text-gray-700 mb-4">
                We may terminate or suspend your access to the service immediately, without prior notice, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
              <p class="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the province in which our 
                legal practice operates, without regard to conflict of law provisions.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p class="text-gray-700 mb-4">
                We reserve the right to update these terms at any time. We will notify users of any 
                material changes by posting the new Terms of Service on this page and updating the 
                "last updated" date.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p class="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700 mb-2">
                  <strong>Legal Services Portal</strong><br>
                  Email: info@legalservices.ca<br>
                  Phone: 1-800-LEGAL-HELP<br>
                  Address: [Legal Practice Address]
                </p>
              </div>
            </section>

          </mat-card-content>
        </mat-card>

        <!-- Navigation -->
        <div class="text-center">
          <button 
            mat-raised-button 
            color="primary"
            [routerLink]="['/']"
            class="mr-4"
          >
            <mat-icon>home</mat-icon>
            Return to Home
          </button>
          
          <button 
            mat-button 
            [routerLink]="['/privacy']"
          >
            <mat-icon>security</mat-icon>
            Privacy Policy
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .terms-page {
      line-height: 1.6;
    }

    .prose {
      color: #374151;
    }

    .prose h2 {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }

    .prose section {
      margin-bottom: 2rem;
    }

    .prose ul {
      margin-left: 1rem;
    }

    .prose li {
      margin-bottom: 0.5rem;
    }

    .prose strong {
      font-weight: 600;
      color: #1f2937;
    }
  `]
})
export class TermsComponent {
  lastUpdated = new Date('2024-01-01');
}
