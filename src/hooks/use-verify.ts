import { useMutation } from '@tanstack/react-query';

// Configure API client
import '@/lib/api-config';

// Verify API base URL (varsayılan port 8086)
const VERIFY_API_URL = import.meta.env.VITE_VERIFY_API_URL || 'http://localhost:8086';

export enum VerificationLevel {
  SIMPLE = 'SIMPLE',
  COMPREHENSIVE = 'COMPREHENSIVE',
}

export interface VerificationResult {
  valid: boolean;
  status: string;
  signatureCount?: number;
  signatures?: SignatureInfo[];
  errors?: string[];
  warnings?: string[];
  verificationTime?: string;
}

export interface SignatureInfo {
  signatureLevel?: string;
  signingTime?: string;
  signerName?: string;
  valid?: boolean;
  certificateValid?: boolean;
  timestampValid?: boolean;
}

export interface TimestampVerificationResult {
  valid: boolean;
  status: string;
  timestampTime?: string;
  tsaName?: string;
  digestAlgorithm?: string;
  messageImprint?: string;
  tsaCertificate?: {
    subjectDN?: string;
    notBefore?: string;
    notAfter?: string;
  };
  verificationTime?: string;
  errors?: string[];
}

export interface VerifyPadesDto {
  signedDocument: File;
  level?: VerificationLevel;
  checkRevocation?: boolean;
  validateTimestamp?: boolean;
}

export interface VerifyXadesDto {
  signedDocument: File;
  originalDocument?: File;
  level?: VerificationLevel;
  checkRevocation?: boolean;
  validateTimestamp?: boolean;
}

export interface VerifyTimestampDto {
  timestampToken: File;
  originalData?: File;
  validateCertificate?: boolean;
}

// PAdES (PDF) Verification
export const useVerifyPDF = () => {
  return useMutation({
    mutationFn: async (data: VerifyPadesDto) => {
      const formData = new FormData();
      formData.append('signedDocument', data.signedDocument);
      
      if (data.level) {
        formData.append('level', data.level);
      }
      if (data.checkRevocation !== undefined) {
        formData.append('checkRevocation', String(data.checkRevocation));
      }
      if (data.validateTimestamp !== undefined) {
        formData.append('validateTimestamp', String(data.validateTimestamp));
      }

      const endpoint = data.level === VerificationLevel.COMPREHENSIVE 
        ? `${VERIFY_API_URL}/api/v1/verify/pades`
        : `${VERIFY_API_URL}/api/v1/verify/pades/simple`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'PDF doğrulama başarısız oldu');
      }

      return response.json() as Promise<VerificationResult>;
    },
  });
};

// XAdES (XML) Verification
export const useVerifyXML = () => {
  return useMutation({
    mutationFn: async (data: VerifyXadesDto) => {
      const formData = new FormData();
      formData.append('signedDocument', data.signedDocument);
      
      if (data.originalDocument) {
        formData.append('originalDocument', data.originalDocument);
      }
      if (data.level) {
        formData.append('level', data.level);
      }
      if (data.checkRevocation !== undefined) {
        formData.append('checkRevocation', String(data.checkRevocation));
      }
      if (data.validateTimestamp !== undefined) {
        formData.append('validateTimestamp', String(data.validateTimestamp));
      }

      const endpoint = data.level === VerificationLevel.COMPREHENSIVE 
        ? `${VERIFY_API_URL}/api/v1/verify/xades`
        : `${VERIFY_API_URL}/api/v1/verify/xades/simple`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'XML doğrulama başarısız oldu');
      }

      return response.json() as Promise<VerificationResult>;
    },
  });
};

// Timestamp Verification
export const useVerifyTimestamp = () => {
  return useMutation({
    mutationFn: async (data: VerifyTimestampDto) => {
      const formData = new FormData();
      formData.append('timestampToken', data.timestampToken);
      
      if (data.originalData) {
        formData.append('originalData', data.originalData);
      }
      if (data.validateCertificate !== undefined) {
        formData.append('validateCertificate', String(data.validateCertificate));
      }

      const response = await fetch(`${VERIFY_API_URL}/api/v1/verify/timestamp`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Zaman damgası doğrulama başarısız oldu');
      }

      return response.json() as Promise<TimestampVerificationResult>;
    },
  });
};

