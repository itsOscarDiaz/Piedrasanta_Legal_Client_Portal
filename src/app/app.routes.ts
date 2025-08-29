import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'intake',
    loadComponent: () => import('./pages/intake.component').then(m => m.IntakeComponent)
  },
  {
    path: 'intake/review',
    loadComponent: () => import('./pages/review.component').then(m => m.ReviewComponent)
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/success.component').then(m => m.SuccessComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms.component').then(m => m.TermsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
