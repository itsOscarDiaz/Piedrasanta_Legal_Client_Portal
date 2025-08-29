import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <div class="landing-page">
      
      <!-- Hero Section -->
      <section class="hero-section bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div class="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div class="text-center">
            <h1 class="text-4xl sm:text-6xl font-bold mb-6">
              Legal Services for Everyone
            </h1>
            <p class="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional legal assistance in immigration, civil litigation, criminal matters, 
              and more. Get started with our comprehensive intake process.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                mat-raised-button 
                color="accent"
                [routerLink]="['/intake']"
                class="text-lg px-8 py-3"
              >
                <mat-icon>assignment</mat-icon>
                Start Intake Process
              </button>
              <button 
                mat-stroked-button 
                class="text-lg px-8 py-3 border-white text-white"
                (click)="scrollToServices()"
              >
                <mat-icon>info</mat-icon>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Overview -->
      <section #servicesSection class="services-section py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Legal Services
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive legal assistance across multiple practice areas, 
              ensuring you get the help you need for your specific situation.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <!-- Immigration Services -->
            <mat-card class="service-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="text-blue-600">flight_takeoff</mat-icon>
                <mat-card-title>Immigration Issues</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600">
                  Work permits, permanent residency, refugee claims, family sponsorship, 
                  and citizenship applications.
                </p>
              </mat-card-content>
            </mat-card>

            <!-- Civil Litigation -->
            <mat-card class="service-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="text-green-600">gavel</mat-icon>
                <mat-card-title>Civil Litigation</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600">
                  Contract disputes, personal injury claims, property matters, 
                  and commercial litigation.
                </p>
              </mat-card-content>
            </mat-card>

            <!-- Criminal Matters -->
            <mat-card class="service-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="text-red-600">shield</mat-icon>
                <mat-card-title>Criminal Matters</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600">
                  Criminal defense, appeals, bail applications, and legal representation 
                  for criminal charges.
                </p>
              </mat-card-content>
            </mat-card>

            <!-- Labour Matters -->
            <mat-card class="service-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="text-purple-600">work</mat-icon>
                <mat-card-title>Labour Matters</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600">
                  Employment disputes, wrongful dismissal, workplace harassment, 
                  and labour negotiations.
                </p>
              </mat-card-content>
            </mat-card>

            <!-- WSIB Issues -->
            <mat-card class="service-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="text-orange-600">medical_services</mat-icon>
                <mat-card-title>WSIB Issues</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600">
                  Workplace injury claims, WSIB appeals, disability benefits, 
                  and compensation disputes.
                </p>
              </mat-card-content>
            </mat-card>

            <!-- Additional Services -->
            <mat-card class="service-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="text-indigo-600">support</mat-icon>
                <mat-card-title>Support Services</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600">
                  Translation services, interpretation, document analysis, 
                  and form filling assistance.
                </p>
              </mat-card-content>
            </mat-card>

          </div>
        </div>
      </section>

      <!-- Process Overview -->
      <section class="process-section py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined intake process ensures we understand your needs 
              and can provide the best possible legal assistance.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="process-step text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-blue-600 text-3xl">edit</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">1. Complete Intake</h3>
              <p class="text-gray-600">
                Fill out our comprehensive intake form with your personal details, 
                case information, and upload relevant documents.
              </p>
            </div>

            <div class="process-step text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-green-600 text-3xl">review</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">2. Review & Submit</h3>
              <p class="text-gray-600">
                Review your information for accuracy, make any necessary changes, 
                and submit your application securely.
              </p>
            </div>

            <div class="process-step text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-purple-600 text-3xl">contact_support</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">3. Get Assistance</h3>
              <p class="text-gray-600">
                Our legal team will review your case and contact you to discuss 
                next steps and available options.
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta-section py-16 bg-blue-900 text-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            Don't wait to get the legal help you need. Our intake process is quick, 
            secure, and designed to understand your unique situation.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              mat-raised-button 
              color="accent"
              [routerLink]="['/intake']"
              class="text-lg px-8 py-3"
            >
              <mat-icon>assignment</mat-icon>
              Start Your Intake
            </button>
            
            <button 
              mat-stroked-button 
              class="text-lg px-8 py-3 border-white text-white"
              [routerLink]="['/privacy']"
            >
              <mat-icon>security</mat-icon>
              Privacy Policy
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer py-8 bg-gray-900 text-gray-300">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div>
              <h3 class="text-white font-semibold mb-4">Legal Services Portal</h3>
              <p class="text-gray-400">
                Professional legal assistance for immigration, civil, criminal, 
                and labour matters.
              </p>
            </div>

            <div>
              <h3 class="text-white font-semibold mb-4">Quick Links</h3>
              <div class="space-y-2">
                <a [routerLink]="['/intake']" class="block hover:text-white transition-colors">
                  Start Intake
                </a>
                <a [routerLink]="['/privacy']" class="block hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a [routerLink]="['/terms']" class="block hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            <div>
              <h3 class="text-white font-semibold mb-4">Contact</h3>
              <div class="space-y-2 text-gray-400">
                <p>Professional legal consultation</p>
                <p>Secure document handling</p>
                <p>Multilingual support available</p>
              </div>
            </div>

          </div>
          
          <mat-divider class="my-8 border-gray-700"></mat-divider>
          
          <div class="text-center text-gray-500">
            <p>&copy; 2024 Legal Services Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
    }

    .hero-section {
      background-image: 
        linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%),
        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="%23ffffff05" points="0,0 1000,300 1000,1000 0,700"/></svg>');
      background-size: cover;
      background-position: center;
    }

    .service-card {
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .process-step {
      padding: 2rem 1rem;
    }

    .cta-section {
      background-image: 
        linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%);
    }

    mat-icon[mat-card-avatar] {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .footer a:hover {
      color: white;
    }

    .mat-mdc-raised-button.mat-accent {
      --mdc-protected-button-container-color: #ff6b35;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2.5rem;
      }
      
      .hero-section p {
        font-size: 1.125rem;
      }
    }
  `]
})
export class LandingComponent {
  
  scrollToServices(): void {
    const element = document.querySelector('.services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
