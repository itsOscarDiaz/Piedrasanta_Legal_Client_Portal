import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FileUploadMetadata, UploadProgress } from '../models/intake.models';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadedFiles: Map<string, FileUploadMetadata> = new Map();

  constructor() {}

  getSignedUrl(filename: string, contentType: string): Observable<string> {
    // Mock S3 signed URL generation
    const mockSignedUrl = `https://mock-s3-bucket.s3.amazonaws.com/${Date.now()}-${filename}?signature=mock-signature`;
    return of(mockSignedUrl).pipe(delay(100));
  }

  upload(file: File, description?: string, clientId?: string): Observable<UploadProgress> {
    return new Observable(observer => {
      // Validate file size (25MB limit)
      const maxSizeMB = 25;
      if (file.size > maxSizeMB * 1024 * 1024) {
        observer.error(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];

      if (!allowedTypes.includes(file.type)) {
        observer.error('File type not allowed');
        return;
      }

      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);

          // Store file metadata
          const metadata: FileUploadMetadata = {
            url: `mock://uploaded-files/${Date.now()}-${file.name}`,
            filename: file.name,
            clientId,
            uploadedAt: new Date(),
            description,
            size: file.size,
            type: file.type
          };

          const fileId = this.generateFileId();
          this.uploadedFiles.set(fileId, metadata);

          observer.next({
            filename: file.name,
            progress: 100,
            status: 'completed'
          });
          observer.complete();
        } else {
          observer.next({
            filename: file.name,
            progress: Math.round(progress),
            status: 'uploading'
          });
        }
      }, 200);

      // Cleanup on unsubscribe
      return () => {
        clearInterval(progressInterval);
      };
    });
  }

  uploadMultiple(files: File[], description?: string, clientId?: string): Observable<UploadProgress[]> {
    const uploads = Array.from(files).map(file => this.upload(file, description, clientId));
    
    return new Observable(observer => {
      const results: UploadProgress[] = new Array(files.length);
      let completed = 0;

      uploads.forEach((upload$, index) => {
        upload$.subscribe({
          next: (progress) => {
            results[index] = progress;
            observer.next([...results]);
            
            if (progress.status === 'completed') {
              completed++;
              if (completed === files.length) {
                observer.complete();
              }
            }
          },
          error: (error) => {
            results[index] = {
              filename: files[index].name,
              progress: 0,
              status: 'error',
              error: error.message || 'Upload failed'
            };
            observer.next([...results]);
          }
        });
      });
    });
  }

  getUploadedFiles(): FileUploadMetadata[] {
    return Array.from(this.uploadedFiles.values());
  }

  getFileMetadata(fileId: string): FileUploadMetadata | null {
    return this.uploadedFiles.get(fileId) || null;
  }

  deleteFile(fileId: string): Observable<boolean> {
    // Mock file deletion
    return of(this.uploadedFiles.delete(fileId)).pipe(delay(100));
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSizeMB = 25;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  }
}
