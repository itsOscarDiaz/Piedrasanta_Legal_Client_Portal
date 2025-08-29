import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';
import { UploadProgress, FileUploadMetadata } from '../models/intake.models';

@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileDropzoneComponent),
      multi: true
    }
  ],
  template: `
    <div class="file-dropzone">
      <!-- Dropzone Area -->
      <div 
        class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
        [ngClass]="{
          'border-blue-400 bg-blue-50': isDragOver,
          'border-gray-300': !isDragOver,
          'border-red-400': hasError
        }"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <mat-icon class="text-4xl text-gray-400 mb-2">cloud_upload</mat-icon>
        <p class="text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p class="text-sm text-gray-500">
          Supported: {{ acceptedTypes.join(', ') }} (Max {{ maxSizeMB }}MB each)
        </p>
        
        <input 
          #fileInput
          type="file" 
          class="hidden" 
          [accept]="accept.join(',')"
          [multiple]="multiple"
          (change)="onFileSelected($event)"
        />
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </div>

      <!-- Upload Progress -->
      <div *ngIf="uploadProgress.length > 0" class="mt-4 space-y-2">
        <h4 class="font-medium text-gray-900">Upload Progress</h4>
        <div *ngFor="let progress of uploadProgress" class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-700">{{ progress.filename }}</span>
            <span [ngClass]="{
              'text-green-600': progress.status === 'completed',
              'text-red-600': progress.status === 'error',
              'text-blue-600': progress.status === 'uploading'
            }">
              {{ progress.status === 'uploading' ? progress.progress + '%' : 
                 progress.status === 'completed' ? 'Complete' : 'Error' }}
            </span>
          </div>
          <mat-progress-bar 
            [value]="progress.progress"
            [color]="progress.status === 'error' ? 'warn' : 'primary'"
          ></mat-progress-bar>
          <div *ngIf="progress.error" class="text-xs text-red-600">
            {{ progress.error }}
          </div>
        </div>
      </div>

      <!-- Uploaded Files List -->
      <div *ngIf="uploadedFiles.length > 0" class="mt-4">
        <h4 class="font-medium text-gray-900 mb-2">Uploaded Files</h4>
        <div class="space-y-2">
          <div 
            *ngFor="let file of uploadedFiles; let i = index" 
            class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <mat-icon class="text-gray-500">description</mat-icon>
                <span class="font-medium">{{ file.filename }}</span>
              </div>
              
              <!-- File metadata inputs -->
              <div *ngIf="fileMeta && fileMeta.length > 0" class="mt-2 space-y-2">
                <mat-form-field *ngIf="fileMeta.includes('description')" appearance="outline" class="w-full">
                  <mat-label>Description</mat-label>
                  <input 
                    matInput 
                    [(ngModel)]="file.description"
                    (ngModelChange)="onFileMetaChange()"
                    placeholder="Describe this document..."
                  />
                </mat-form-field>
                
                <mat-form-field *ngIf="fileMeta.includes('date')" appearance="outline" class="w-full">
                  <mat-label>Document Date</mat-label>
                  <input 
                    matInput 
                    type="date"
                    [(ngModel)]="file.date"
                    (ngModelChange)="onFileMetaChange()"
                  />
                </mat-form-field>
              </div>
              
              <div class="text-sm text-gray-500 mt-1">
                {{ formatFileSize(file.size) }} • Uploaded {{ formatDate(file.uploadedAt) }}
              </div>
            </div>
            
            <button 
              mat-icon-button 
              color="warn"
              (click)="removeFile(i)"
              class="ml-2"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-dropzone {
      width: 100%;
    }
    
    .border-dashed {
      cursor: pointer;
    }
  `]
})
export class FileDropzoneComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() accept: string[] = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
  @Input() multiple = false;
  @Input() maxSizeMB = 25;
  @Input() fileMeta: string[] = [];
  @Input() label = '';

  @Output() filesChanged = new EventEmitter<FileUploadMetadata[]>();

  isDragOver = false;
  errorMessage = '';
  hasError = false;
  uploadProgress: UploadProgress[] = [];
  uploadedFiles: (FileUploadMetadata & { date?: string })[] = [];

  private uploadSubscription?: Subscription;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  get acceptedTypes(): string[] {
    return this.accept.map(type => type.replace('.', '').toUpperCase());
  }

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.uploadSubscription?.unsubscribe();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      this.uploadedFiles = Array.isArray(value) ? value : [value];
    } else {
      this.uploadedFiles = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(files: File[]): void {
    this.clearError();

    // Validate file count
    if (!this.multiple && files.length > 1) {
      this.setError('Only one file is allowed');
      return;
    }

    // Validate each file
    for (const file of files) {
      const validation = this.fileUploadService.validateFile(file);
      if (!validation.valid) {
        this.setError(validation.error || 'Invalid file');
        return;
      }
    }

    // Start upload
    this.uploadFiles(files);
  }

  private uploadFiles(files: File[]): void {
    this.uploadSubscription?.unsubscribe();
    this.uploadProgress = [];

    if (this.multiple) {
      this.uploadSubscription = this.fileUploadService.uploadMultiple(files).subscribe({
        next: (progressArray) => {
          this.uploadProgress = progressArray;
          
          // Check if all uploads are complete
          const completed = progressArray.filter(p => p.status === 'completed');
          if (completed.length === files.length) {
            this.onUploadComplete();
          }
        },
        error: (error) => {
          this.setError(error.message || 'Upload failed');
        }
      });
    } else {
      const file = files[0];
      this.uploadSubscription = this.fileUploadService.upload(file).subscribe({
        next: (progress) => {
          this.uploadProgress = [progress];
          
          if (progress.status === 'completed') {
            this.onUploadComplete();
          }
        },
        error: (error) => {
          this.setError(error.message || 'Upload failed');
        }
      });
    }
  }

  private onUploadComplete(): void {
    // Convert progress to file metadata
    const newFiles = this.uploadProgress
      .filter(p => p.status === 'completed')
      .map(p => ({
        url: `mock://uploaded/${p.filename}`,
        filename: p.filename,
        uploadedAt: new Date(),
        size: 0, // Would be set from actual upload
        type: '',
        description: ''
      }));

    if (this.multiple) {
      this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
    } else {
      this.uploadedFiles = newFiles;
    }

    this.emitValue();
    this.uploadProgress = [];
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.emitValue();
  }

  onFileMetaChange(): void {
    this.emitValue();
  }

  private emitValue(): void {
    const value = this.multiple ? this.uploadedFiles : this.uploadedFiles[0] || null;
    this.onChange(value);
    this.filesChanged.emit(this.uploadedFiles);
    this.onTouched();
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.hasError = true;
    setTimeout(() => this.clearError(), 5000);
  }

  private clearError(): void {
    this.errorMessage = '';
    this.hasError = false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
