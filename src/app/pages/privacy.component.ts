import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="privacy-page min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p class="text-gray-600">
            Last updated: {{ lastUpdated | date:'longDate' }}
          </p>
        </div>

        <mat-card class="mb-8">
          <mat-card-content class="prose max-w-none p-8">
            
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p class="text-gray-700 mb-4">
                We collect information you provide directly to us through our legal services intake process, including:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Personal identification information (name, address, phone, email)</li>
                <li>Immigration status and documentation</li>
                <li>Legal case details and circumstances</li>
                <li>Supporting documents and evidence</li>
                <li>Payment and billing information</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p class="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide legal services and consultation</li>
                <li>Assess your case and determine appropriate legal strategies</li>
                <li>Communicate with you about your case and legal matters</li>
                <li>Prepare legal documents and applications</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services and client experience</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">3. Information Security</h2>
              <p class="text-gray-700 mb-4">
                We implement robust security measures to protect your personal information:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure cloud-based storage systems that meet Canadian privacy standards</li>
                <li>Access controls and authentication procedures</li>
                <li>Regular security audits and monitoring</li>
                <li>Employee training on data protection and confidentiality</li>
                <li>Secure file transfer and communication channels</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">4. Sharing of Information</h2>
              <p class="text-gray-700 mb-4">
                We may share your information only in the following circumstances:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>With your explicit consent</li>
                <li>With other legal professionals working on your case</li>
                <li>With government agencies as required for legal proceedings</li>
                <li>With court systems when filing applications or documents</li>
                <li>With translation or interpretation service providers (under confidentiality agreements)</li>
                <li>As required by law or legal process</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p class="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide ongoing legal services</li>
                <li>Comply with legal and professional obligations</li>
                <li>Maintain attorney-client privilege protections</li>
                <li>Handle any appeals or ongoing legal matters</li>
              </ul>
              <p class="text-gray-700 mb-4">
                Generally, we retain client files for a minimum of 7 years after the conclusion of legal services, 
                or as required by applicable law and professional regulations.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p class="text-gray-700 mb-4">
                Under Canadian privacy law, you have the right to:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Access your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Withdraw consent for certain uses of your information</li>
                <li>Request a copy of your personal information</li>
                <li>File a complaint with privacy authorities</li>
              </ul>
              <p class="text-gray-700 mb-4">
                Please note that some limitations may apply due to attorney-client privilege 
                and legal professional obligations.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p class="text-gray-700 mb-4">
                Our website uses essential cookies to:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Maintain your session during the intake process</li>
                <li>Save your progress automatically</li>
                <li>Ensure website security and functionality</li>
                <li>Remember your preferences</li>
              </ul>
              <p class="text-gray-700 mb-4">
                We do not use tracking cookies for advertising or marketing purposes.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p class="text-gray-700 mb-4">
                We may use trusted third-party services for:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Secure document storage and management</li>
                <li>Email communication and client portals</li>
                <li>Payment processing</li>
                <li>Translation and interpretation services</li>
              </ul>
              <p class="text-gray-700 mb-4">
                All third-party providers are required to maintain appropriate security 
                measures and confidentiality agreements.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">9. Updates to This Policy</h2>
              <p class="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any 
                material changes by posting the new policy on our website and updating the 
                "last updated" date.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p class="text-gray-700 mb-4">
                If you have questions about this privacy policy or how we handle your personal information, 
                please contact us:
              </p>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700 mb-2">
                  <strong>Privacy Officer</strong><br>
                  Legal Services Portal<br>
                  Email: privacy@legalservices.ca<br>
                  Phone: 1-800-LEGAL-HELP
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
            [routerLink]="['/terms']"
          >
            <mat-icon>description</mat-icon>
            Terms of Service
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .privacy-page {
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
  `]
})
export class PrivacyComponent {
  lastUpdated = new Date('2024-01-01');
}
