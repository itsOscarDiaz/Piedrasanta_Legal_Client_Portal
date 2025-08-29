# Legal Services Client Management Portal

A comprehensive, schema-driven intake wizard for legal services built with Angular, TypeScript, Reactive Forms, Tailwind CSS, and Angular Material.

## 🚀 Features

- **Schema-Driven Intake Wizard**: Dynamic form generation from JSON schema
- **Multi-Step Process**: Progress tracking with Angular Material Stepper
- **File Upload System**: Drag-and-drop with metadata capture and S3-ready architecture
- **Auto-save & Resume**: LocalStorage persistence with draft recovery
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Print-Friendly Review**: Professional document generation
- **Validation System**: Comprehensive form validation with error handling
- **Privacy Compliant**: Secure data handling meeting Canadian privacy standards

## 📋 Services Supported

- Immigration Issues (Work permits, PR, Refugee claims, Citizenship)
- Civil Litigation
- Criminal Matters
- Labour Matters
- WSIB Issues
- Appeals
- Translation Services
- Interpretation Services
- Video/Audio Analysis
- Form Filling Assistance

## 🛠 Tech Stack

- **Frontend**: Angular 20+ (Standalone Components)
- **Styling**: Tailwind CSS + Angular Material
- **Forms**: Reactive Forms with custom validation
- **State Management**: In-memory services with localStorage
- **File Handling**: Mock S3 upload service (production-ready architecture)
- **Build**: Angular CLI with SSR support

## 📁 Project Structure

```
legal-client-portal/
├── src/
│   ├── app/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── autosave-indicator.component.ts
│   │   │   ├── dynamic-field.component.ts
│   │   │   ├── file-dropzone.component.ts
│   │   │   ├── intake-stepper.component.ts
│   │   │   └── review-panel.component.ts
│   │   ├── models/               # TypeScript interfaces
│   │   │   └── intake.models.ts
│   │   ├── pages/                # Route components
│   │   │   ├── landing.component.ts
│   │   │   ├── intake.component.ts
│   │   │   ├── review.component.ts
│   │   │   ├── success.component.ts
│   │   │   ├── privacy.component.ts
│   │   │   └── terms.component.ts
│   │   ├── services/             # Business logic services
│   │   │   ├── schema-loader.service.ts
│   │   │   ├── intake-state.service.ts
│   │   │   ├── file-upload.service.ts
│   │   │   └── validation.service.ts
│   │   ├── app.routes.ts         # Routing configuration
│   │   ├── app.config.ts         # App configuration
│   │   └── app.ts                # Root component
│   ├── assets/
│   │   └── intake/
│   │       └── intake.schema.json # Form schema definition
│   ├── styles.scss               # Global styles with Tailwind
│   └── index.html
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone or extract the project**
   ```bash
   cd legal-client-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests

## 📝 Schema Configuration

The intake form is entirely driven by the schema located at `src/assets/intake/intake.schema.json`. This file defines:

- **Sections**: Logical groupings of fields
- **Field Types**: text, textarea, email, tel, select, radio, checkbox, toggle, date, month, number, file, repeater, multiselect
- **Validation Rules**: required fields, patterns, constraints
- **Conditional Logic**: field reveals based on other field values
- **File Constraints**: accepted types, size limits, metadata requirements

### Example Schema Structure

```json
{
  "title": "Legal Services Intake",
  "version": "1.0.0",
  "sections": [
    {
      "id": "personal_details",
      "title": "Personal Details",
      "fields": [
        {
          "id": "full_name",
          "label": "Full Name",
          "type": "text",
          "required": true
        },
        {
          "id": "status_in_canada",
          "label": "Current Status in Canada",
          "type": "select",
          "required": true,
          "options": ["Citizen", "Permanent Resident", "Refugee", "Work Permit"]
        }
      ]
    }
  ]
}
```

## 🔧 Key Components

### IntakeStepperComponent
- Material Stepper integration
- Progress tracking
- Draft resume functionality
- Section validation

### DynamicFieldComponent  
- Universal field renderer
- Support for all field types
- Conditional field reveals
- Built-in validation display

### FileDropzoneComponent
- Drag-and-drop file upload
- Progress tracking
- Metadata capture
- File type/size validation

### ReviewPanelComponent
- Print-friendly layout
- Editable sections
- Completion status
- E-signature placeholder

## 🔌 Services Architecture

### SchemaLoaderService
- Loads and normalizes intake schema
- Provides field/section lookup methods
- Handles schema validation

### IntakeStateService
- Manages form state across components
- Auto-save with localStorage
- Progress calculation
- Draft management

### FileUploadService
- Mock S3 signed URL generation
- Upload progress tracking
- File validation
- Metadata storage

### ValidationService
- Schema-based validation
- Custom validators (email, phone, date)
- Error message generation
- Section-level validation

## 🎨 Styling & UI

- **Tailwind CSS**: Utility-first styling
- **Angular Material**: Component library for professional UI
- **Responsive Design**: Mobile-first approach
- **Print Styles**: Optimized for document printing
- **Theme**: Azure/Blue Material theme

## 🔒 Security & Privacy

- **Data Encryption**: All form data handled securely
- **Privacy Compliance**: Canadian privacy standards
- **Secure Storage**: Encrypted localStorage for drafts
- **File Validation**: Comprehensive upload security
- **No Tracking**: Privacy-focused, no analytics cookies

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Configuration

For production deployment:

1. **Update API endpoints** in services (replace mock URLs)
2. **Configure real S3 integration** in FileUploadService
3. **Set up SSL/TLS** for secure data transmission
4. **Configure CSP headers** for additional security
5. **Set up proper error monitoring**

### Server Requirements

- **Web Server**: Nginx/Apache with Angular routing support
- **SSL Certificate**: Required for secure form submission
- **File Storage**: S3-compatible storage for document uploads
- **Database**: For persistent form data storage

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Coverage

The application includes unit tests for:
- Service logic and state management
- Component rendering and interactions
- Form validation rules
- File upload functionality

## 🤝 Contributing

### Code Standards

- **TypeScript**: Strict type checking enabled
- **Angular Style Guide**: Following official Angular conventions
- **Prettier**: Code formatting (config in package.json)
- **ESLint**: Code quality enforcement

### Adding New Field Types

1. Update `FieldType` in `intake.models.ts`
2. Add rendering logic in `DynamicFieldComponent`
3. Update validation in `ValidationService`
4. Add to schema documentation

## 📄 Legal Compliance

### Attorney-Client Privilege

- Form submission does not establish attorney-client relationship
- Privacy protections in place until formal retainer
- Clear disclaimers on all pages

### Data Retention

- Draft data: Cleared on submission or user request
- Submitted data: Retained per legal requirements
- Document uploads: Secure storage with access controls

## 🔍 Troubleshooting

### Common Issues

**Form not loading**
- Check console for schema loading errors
- Verify `intake.schema.json` is accessible
- Ensure HTTP client is properly configured

**Auto-save not working**
- Check localStorage availability
- Verify browser storage limits
- Check console for service errors

**File uploads failing**
- Verify file size limits (25MB default)
- Check accepted file types
- Ensure proper MIME type detection

### Debug Mode

Set `localStorage.setItem('debug', 'true')` for additional logging.

## 📞 Support

For technical issues or questions:
- Review console logs for error details
- Check browser developer tools
- Verify all dependencies are correctly installed

## 📜 License

This project is proprietary software for legal services intake management.

---

**Built with ❤️ for Legal Services Professionals**