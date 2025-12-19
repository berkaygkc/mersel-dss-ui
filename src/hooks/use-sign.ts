import { useMutation } from '@tanstack/react-query';
import { PadesControllerService, XadesControllerService, CadesControllerService, HashSignService } from '@/api/generated';
import type { SignPadesDto, SignXadesDto, SignWsSecurityDto, TimestampType, SignHashRequest, SignHashResponse } from '@/api/generated';

// Configure API client
import '@/lib/api-config';

// Re-export DocumentType for convenience
export { DocumentType } from '@/api/generated';

// PDF Signing
export const useSignPDF = () => {
  return useMutation({
    mutationFn: async (data: SignPadesDto) => {
      const blob = await PadesControllerService.signPades(data);
      return blob;
    },
  });
};

// XML Signing
export const useSignXML = () => {
  return useMutation({
    mutationFn: async (data: SignXadesDto) => {
      const blob = await XadesControllerService.signXades(data);
      return blob;
    },
  });
};

// SOAP Signing
export const useSignSOAP = () => {
  return useMutation({
    mutationFn: async (data: SignWsSecurityDto) => {
      const blob = await XadesControllerService.signWsSecurity(data);
      return blob;
    },
  });
};

// CAdES Signing
export interface SignCadesData {
  content: string;
  timestampType?: TimestampType;
  signatureId?: string;
}

export const useSignCAdES = () => {
  return useMutation({
    mutationFn: async (data: SignCadesData) => {
      const blob = await CadesControllerService.signCades(
        data.content,
        data.timestampType || 'signature',
        data.signatureId
      );
      return blob;
    },
  });
};

// Hash Signing
export const useSignHash = () => {
  return useMutation({
    mutationFn: async (data: SignHashRequest): Promise<SignHashResponse> => {
      const response = await HashSignService.signHash(data);
      return response;
    },
  });
};
