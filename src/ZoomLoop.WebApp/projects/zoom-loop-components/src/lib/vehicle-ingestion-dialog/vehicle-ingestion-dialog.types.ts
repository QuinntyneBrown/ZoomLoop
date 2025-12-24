export type ProcessingStep =
  | 'idle'
  | 'uploading'
  | 'extracting_vin'
  | 'analyzing_condition'
  | 'generating_description'
  | 'saving'
  | 'completed'
  | 'failed';

export type ConditionRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export type IngestionErrorCode =
  | 'VIN_NOT_FOUND'
  | 'UPLOAD_FAILED'
  | 'PROCESSING_FAILED'
  | 'NETWORK_ERROR';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
  isUploaded: boolean;
  order: number;
}

export interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface IngestionResult {
  vehicleId: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  doors: number;
  interiorCondition: ConditionRating;
  exteriorCondition: ConditionRating;
  description: string;
  images: VehicleImage[];
}

export interface IngestionError {
  code: IngestionErrorCode;
  message: string;
  retryable: boolean;
}

export interface VehicleIngestionState {
  uploadedImages: UploadedImage[];
  isUploading: boolean;
  uploadProgress: number;
  processingStep: ProcessingStep;
  isProcessing: boolean;
  processingProgress: number;
  estimatedTimeRemaining: number | null;
  result: IngestionResult | null;
  error: IngestionError | null;
  manualVIN: string;
  isManualEntry: boolean;
}

export interface IngestionStartedEvent {
  imageCount: number;
}

export interface IngestionCompletedEvent {
  vehicleId: string;
  vin: string;
  processingTimeMs: number;
}

export interface IngestionFailedEvent {
  errorCode: IngestionErrorCode;
  errorMessage: string;
}
