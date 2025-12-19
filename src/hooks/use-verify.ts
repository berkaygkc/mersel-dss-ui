import { useMutation } from '@tanstack/react-query';

// Configure API client
import '@/lib/api-config';
import { VERIFY_API_URL } from '@/lib/runtime-config';

export enum VerificationLevel {
  SIMPLE = 'SIMPLE',
  COMPREHENSIVE = 'COMPREHENSIVE',
}

export interface CertificateInfo {
  subject?: string;
  commonName?: string;
  issuerDN?: string;
  serialNumber?: string;
  subjectSerialNumber?: string;
  notBefore?: string;
  notAfter?: string;
  keyUsage?: string;
  publicKeyAlgorithm?: string;
  publicKeySize?: number;
  signatureAlgorithm?: string;
  trusted?: boolean;
  expired?: boolean;
  valid?: boolean;
  revoked?: boolean;
  revocationReason?: string;
  revocationTime?: string;
  revocationDate?: string;
}

export interface TimestampInfo {
  timestampTime?: string;
  timestampType?: string;
  tsaName?: string;
  digestAlgorithm?: string;
  valid?: boolean;
  certificateValid?: boolean;
  errors?: string[];
}

export interface QualificationDetails {
  qualificationLevel?: string;
  qualificationName?: string;
}

export interface ValidationDetails {
  signatureIntact?: boolean;
  certificateChainValid?: boolean;
  certificateNotExpired?: boolean;
  certificateNotRevoked?: boolean;
  trustAnchorReached?: boolean;
  timestampValid?: boolean;
  cryptographicVerificationSuccessful?: boolean;
  revocationCheckPerformed?: boolean;
  additionalDetails?: Record<string, string>;
}

export interface SignatureInfo {
  signatureId?: string;
  valid?: boolean;
  signatureFormat?: string;
  signatureLevel?: string;
  signingTime?: string;
  claimedSigningTime?: string;
  signerCertificate?: CertificateInfo;
  certificateChain?: CertificateInfo[];
  timestamps?: TimestampInfo[];
  signatureAlgorithm?: string;
  digestAlgorithm?: string;
  validationErrors?: string[];
  validationWarnings?: string[];
  indication?: string;
  subIndication?: string;
  qualificationDetails?: QualificationDetails;
  timestampCount?: number;
  policyIdentifier?: string;
  validationDetails?: ValidationDetails;
}

export interface VerificationResult {
  valid: boolean;
  status: string;
  signatureType?: string;
  signatureCount?: number;
  signatures?: SignatureInfo[];
  errors?: string[];
  warnings?: string[];
  verificationTime?: string;
  validationDetails?: ValidationDetails;
}

export interface TimestampVerificationResult {
  valid: boolean;
  status: string;
  timestampTime?: string;
  tsaName?: string;
  digestAlgorithm?: string;
  messageImprint?: string;
  tsaCertificate?: CertificateInfo;
  verificationTime?: string;
  errors?: string[];
  warnings?: string[];
}

export interface VerifyPadesDto {
  signedDocument: File;
  level?: VerificationLevel;
}

export interface VerifyXadesDto {
  signedDocument: File;
  originalDocument?: File;
  level?: VerificationLevel;
}

export interface VerifyTimestampDto {
  timestampToken: File;
  originalData?: File;
  validateCertificate?: boolean;
}

export interface VerifyCadesDto {
  signedDocument: File;
  originalDocument?: File;
  level?: VerificationLevel;
}

// PAdES (PDF) Verification
export const useVerifyPDF = () => {
  return useMutation({
    mutationFn: async (data: VerifyPadesDto) => {
      const formData = new FormData();
      formData.append('signedDocument', data.signedDocument);
      
      // Yeni unified endpoint'e level parametresini gönder
      formData.append('level', data.level || VerificationLevel.SIMPLE);

      const response = await fetch(`${VERIFY_API_URL()}/api/v1/verify/pades`, {
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
      
      // Yeni unified endpoint'e level parametresini gönder
      formData.append('level', data.level || VerificationLevel.SIMPLE);

      const response = await fetch(`${VERIFY_API_URL()}/api/v1/verify/xades`, {
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
      formData.append('timestampFile', data.timestampToken); // Backend 'timestampFile' bekliyor
      
      if (data.originalData) {
        formData.append('originalData', data.originalData);
      }
      
      // validateCertificate parametresini gönder (default: true)
      formData.append('validateCertificate', String(data.validateCertificate !== false));

      const response = await fetch(`${VERIFY_API_URL()}/api/v1/verify/timestamp`, {
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

// CAdES (.p7s) Verification
export const useVerifyCAdES = () => {
  return useMutation({
    mutationFn: async (data: VerifyCadesDto) => {
      const formData = new FormData();
      formData.append('signedDocument', data.signedDocument);
      
      if (data.originalDocument) {
        formData.append('originalDocument', data.originalDocument);
      }
      
      formData.append('level', data.level || VerificationLevel.SIMPLE);

      const response = await fetch(`${VERIFY_API_URL()}/api/v1/verify/cades`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'CAdES doğrulama başarısız oldu');
      }

      return response.json() as Promise<VerificationResult>;
    },
  });
};

