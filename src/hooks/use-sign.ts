import { useMutation } from '@tanstack/react-query';
import { PadesControllerService, XadesControllerService } from '@/api/generated';
import type { SignPadesDto, SignXadesDto, SignWsSecurityDto } from '@/api/generated';

// Configure API client
import '@/lib/api-config';

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
