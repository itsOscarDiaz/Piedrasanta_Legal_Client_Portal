import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface PhoneValue {
  countryCode: string;
  dialCode: string;
  number: string;
  fullNumber: string;
  internationalNumber: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="phone-input-container">
      <div class="flex gap-2">
        <!-- Country Selector with Autocomplete -->
        <div class="country-selector min-w-[140px]">
          <mat-form-field appearance="outline" class="w-full country-field">
            <mat-select 
              [formControl]="countryControl"
              placeholder="Country"
              class="country-select"
            >
              <mat-option *ngFor="let country of countries" [value]="country.code">
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ country.flag }}</span>
                  <span class="text-sm font-medium">{{ country.dialCode }}</span>
                  <span class="text-xs text-gray-500 truncate">{{ country.name }}</span>
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <!-- Phone Number Input -->
        <div class="phone-number-input flex-1 relative">
          <input 
            type="tel" 
            [id]="fieldId"
            [formControl]="phoneControl"
            class="peer block w-full border border-gray-300 rounded-md px-2.5 pt-4 pb-2.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
            [placeholder]="label"
            (input)="onPhoneInput($event)"
            (keydown)="onKeyDown($event)"
            (blur)="onBlur()"
            maxlength="14"
          />
          <label 
            [for]="fieldId" 
            class="floating-label absolute left-2.5 text-gray-500 text-xs transition-all bg-white px-1"
          >
            {{ label }} <span *ngIf="required" class="text-red-500">*</span>
          </label>
        </div>
      </div>
      
      <!-- Preview of Full International Number -->
      <div *ngIf="getSelectedCountry() && phoneControl.value" class="mt-2 text-sm text-gray-600">
        International format: {{ getSelectedCountry()?.dialCode }} {{ phoneControl.value }}
      </div>
      
      <!-- Error Message -->
      <div *ngIf="phoneControl.errors && phoneControl.touched" class="text-sm text-red-600 mt-1">
        {{ getErrorMessage() }}
      </div>
    </div>
  `,
  styles: [`
    .phone-input-container {
      width: 100%;
    }
    
    /* Country field styling */
    .country-field {
      height: 52px;
    }
    
    .country-field ::ng-deep .mat-mdc-form-field-flex {
      height: 52px;
      align-items: center;
    }
    
    .country-field ::ng-deep .mat-mdc-select-trigger {
      height: 100%;
      display: flex;
      align-items: center;
    }
    
    /* Make dropdown scrollable */
    .country-field ::ng-deep .mat-mdc-select-panel {
      max-height: 300px;
      overflow-y: auto;
    }
    
    /* Floating label positioning */
    .floating-label {
      top: -0.5rem;
      z-index: 10;
    }
    
    /* When field is empty and not focused, position label inside */
    input:placeholder-shown + .floating-label {
      top: 0.875rem;
      font-size: 0.875rem;
      color: #9ca3af;
      background: transparent;
      padding: 0;
    }
    
    /* When field has value or is focused, keep label elevated */
    input:not(:placeholder-shown) + .floating-label,
    input:focus + .floating-label {
      top: -0.5rem !important;
      font-size: 0.75rem !important;
      background: white !important;
      padding: 0 0.25rem !important;
      z-index: 10 !important;
    }
    
    /* Focus state color */
    input:focus + .floating-label {
      color: #3b82f6 !important;
    }
    
    /* Phone number input height matching */
    .phone-number-input input {
      height: 52px;
    }
    
    /* Option styling */
    ::ng-deep .mat-mdc-option {
      padding: 8px 16px !important;
      min-height: 48px !important;
    }
    
    /* Custom scrollbar for dropdown */
    ::ng-deep .mat-mdc-select-panel::-webkit-scrollbar {
      width: 6px;
    }
    
    ::ng-deep .mat-mdc-select-panel::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    ::ng-deep .mat-mdc-select-panel::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    ::ng-deep .mat-mdc-select-panel::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `]
})
export class PhoneInputComponent implements OnInit, ControlValueAccessor {
  @Input() label = 'Phone Number';
  @Input() required = false;
  @Input() fieldId = 'phone';
  @Output() valueChange = new EventEmitter<PhoneValue>();

  countryControl = new FormControl('CA');
  phoneControl = new FormControl('', [
    Validators.pattern(/^\d{3}-\d{3}-\d{4}$/),
    Validators.minLength(12)
  ]);

  private onChange = (value: PhoneValue) => {};
  private onTouchedCallback = () => {};

  countries: Country[] = [
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
    { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
    { code: 'AS', name: 'American Samoa', dialCode: '+1684', flag: '🇦🇸' },
    { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
    { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
    { code: 'AI', name: 'Anguilla', dialCode: '+1264', flag: '🇦🇮' },
    { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', flag: '🇦🇬' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
    { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
    { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
    { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
    { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
    { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧' },
    { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
    { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
    { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿' },
    { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
    { code: 'BM', name: 'Bermuda', dialCode: '+1441', flag: '🇧🇲' },
    { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
    { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
    { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦' },
    { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
    { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
    { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
    { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
    { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
    { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
    { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
    { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
    { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫' },
    { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
    { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
    { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
    { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬' },
    { code: 'CD', name: 'Congo (DRC)', dialCode: '+243', flag: '🇨🇩' },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
    { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
    { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
    { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
    { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
    { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
    { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
    { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
    { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: '🇩🇲' },
    { code: 'DO', name: 'Dominican Republic', dialCode: '+1', flag: '🇩🇴' },
    { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
    { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
    { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
    { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
    { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
    { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
    { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
    { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯' },
    { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
    { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
    { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
    { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
    { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
    { code: 'GD', name: 'Grenada', dialCode: '+1473', flag: '🇬🇩' },
    { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
    { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
    { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
    { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
    { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
    { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
    { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
    { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
    { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
    { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
    { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
    { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
    { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
    { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
    { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
    { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬' },
    { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
    { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
    { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
    { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
    { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
    { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
    { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮' },
    { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
    { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
    { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
    { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
    { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
    { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
    { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹' },
    { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
    { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
    { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩' },
    { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨' },
    { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
    { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
    { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
    { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
    { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
    { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
    { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
    { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
    { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
    { code: 'KP', name: 'North Korea', dialCode: '+850', flag: '🇰🇵' },
    { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰' },
    { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
    { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
    { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
    { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
    { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦' },
    { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬' },
    { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
    { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
    { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
    { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
    { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
    { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
    { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸' },
    { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
    { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
    { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
    { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
    { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
    { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
    { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧' },
    { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
    { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
    { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
    { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
    { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
    { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
    { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾' },
    { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯' },
    { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
    { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
    { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴' },
    { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: '🇹🇹' },
    { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
    { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲' },
    { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
    { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
    { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿' },
    { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
    { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
    { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' }
  ];

  ngOnInit(): void {
    // Set up validators based on required input
    if (this.required) {
      this.phoneControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}-\d{3}-\d{4}$/),
        Validators.minLength(12)
      ]);
    }

    // Listen to country changes
    this.countryControl.valueChanges.subscribe(() => {
      this.emitValue();
    });

    // Listen to phone number changes
    this.phoneControl.valueChanges.subscribe(() => {
      this.emitValue();
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: PhoneValue | string | null): void {
    if (!value) {
      this.countryControl.setValue('CA', { emitEvent: false });
      this.phoneControl.setValue('', { emitEvent: false });
      return;
    }

    if (typeof value === 'string') {
      // Handle legacy string phone numbers
      this.phoneControl.setValue(this.formatPhoneNumber(value), { emitEvent: false });
      this.countryControl.setValue('CA', { emitEvent: false });
    } else if (typeof value === 'object') {
      // Handle PhoneValue object
      if (value.countryCode) {
        this.countryControl.setValue(value.countryCode, { emitEvent: false });
      }
      if (value.number) {
        this.phoneControl.setValue(this.formatPhoneNumber(value.number), { emitEvent: false });
      } else if (value.internationalNumber && value.dialCode) {
        // Extract local number from international number
        const localNumber = value.internationalNumber.replace(value.dialCode, '');
        this.phoneControl.setValue(this.formatPhoneNumber(localNumber), { emitEvent: false });
      }
    }
  }

  registerOnChange(fn: (value: PhoneValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  onBlur(): void {
    this.onTouchedCallback();
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.countryControl.disable();
      this.phoneControl.disable();
    } else {
      this.countryControl.enable();
      this.phoneControl.enable();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const cursorStart = input.selectionStart || 0;
    const cursorEnd = input.selectionEnd || 0;
    const value = input.value;

    // Handle backspace key
    if (event.key === 'Backspace') {
      // If there's a selection, let the default behavior handle it
      if (cursorStart !== cursorEnd) {
        return;
      }
      
      // If cursor is right after a hyphen, delete the digit before the hyphen
      if (cursorStart > 0 && value[cursorStart - 1] === '-') {
        event.preventDefault();
        
        // Find the digit before the hyphen and remove it
        let newValue = value;
        if (cursorStart >= 2 && /\d/.test(value[cursorStart - 2])) {
          newValue = value.slice(0, cursorStart - 2) + value.slice(cursorStart);
        } else {
          newValue = value.slice(0, cursorStart - 1) + value.slice(cursorStart);
        }
        
        const formatted = this.formatPhoneNumber(newValue);
        this.phoneControl.setValue(formatted, { emitEvent: false });
        
        // Set cursor position after formatting
        setTimeout(() => {
          const digitsRemoved = value.replace(/\D/g, '').length - formatted.replace(/\D/g, '').length;
          const newPosition = Math.max(0, cursorStart - 1 - (digitsRemoved > 0 ? 1 : 0));
          input.setSelectionRange(newPosition, newPosition);
        });
      }
    }
    
    // Handle delete key
    if (event.key === 'Delete') {
      // If there's a selection, let the default behavior handle it
      if (cursorStart !== cursorEnd) {
        return;
      }
      
      // If cursor is right before a hyphen, delete the hyphen and the next digit
      if (cursorStart < value.length && value[cursorStart] === '-') {
        event.preventDefault();
        
        // Find the digit after the hyphen and remove it
        let newValue = value;
        if (cursorStart + 2 < value.length && /\d/.test(value[cursorStart + 1])) {
          newValue = value.slice(0, cursorStart) + value.slice(cursorStart + 2);
        } else {
          newValue = value.slice(0, cursorStart) + value.slice(cursorStart + 1);
        }
        
        const formatted = this.formatPhoneNumber(newValue);
        this.phoneControl.setValue(formatted, { emitEvent: false });
        
        // Keep cursor position the same
        setTimeout(() => {
          input.setSelectionRange(cursorStart, cursorStart);
        });
      }
    }
  }

  onPhoneInput(event: any): void {
    const input = event.target;
    const inputValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    // Store the original cursor position relative to digits only
    const digitsBeforeCursor = inputValue.slice(0, cursorPosition).replace(/\D/g, '').length;
    
    const formatted = this.formatPhoneNumber(inputValue);
    
    // Update the input value with formatting
    if (formatted !== inputValue) {
      this.phoneControl.setValue(formatted, { emitEvent: false });
      
      // Restore cursor position after formatting
      setTimeout(() => {
        const newCursorPosition = this.calculateCursorPosition(formatted, digitsBeforeCursor);
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }
  }

  private calculateCursorPosition(formattedValue: string, digitsBeforeCursor: number): number {
    let digitCount = 0;
    let position = 0;
    
    for (let i = 0; i < formattedValue.length; i++) {
      if (/\d/.test(formattedValue[i])) {
        if (digitCount === digitsBeforeCursor) {
          return position;
        }
        digitCount++;
      }
      position++;
    }
    
    return position;
  }

  private formatPhoneNumber(value: string): string {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits for North American format
    const limitedDigits = digits.slice(0, 10);
    
    // Apply formatting: XXX-XXX-XXXX
    if (limitedDigits.length === 0) {
      return '';
    } else if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    } else {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  }

  getSelectedCountry(): Country | undefined {
    return this.countries.find(c => c.code === this.countryControl.value);
  }

  private emitValue(): void {
    const selectedCountry = this.getSelectedCountry();
    const phoneNumber = this.phoneControl.value || '';
    
    const phoneValue: PhoneValue = {
      countryCode: this.countryControl.value || 'CA',
      dialCode: selectedCountry?.dialCode || '+1',
      number: phoneNumber,
      fullNumber: selectedCountry ? `${selectedCountry.dialCode} ${phoneNumber}` : phoneNumber,
      internationalNumber: selectedCountry ? `${selectedCountry.dialCode}${phoneNumber.replace(/\D/g, '')}` : phoneNumber.replace(/\D/g, '')
    };

    this.onChange(phoneValue);
    this.valueChange.emit(phoneValue);
  }

  getErrorMessage(): string {
    const errors = this.phoneControl.errors;
    if (!errors) return '';

    if (errors['required']) {
      return `${this.label} is required`;
    }
    if (errors['pattern']) {
      return 'Please enter a valid phone number format (XXX-XXX-XXXX)';
    }
    if (errors['minlength']) {
      return 'Phone number must be at least 10 digits';
    }

    return 'Invalid phone number';
  }
}
