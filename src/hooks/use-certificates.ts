import { useQuery } from '@tanstack/react-query';
import { CertificateInfoService, TBTakService } from '@/api/generated';
import type { CertificateInfoDto } from '@/api/generated';

// Configure API client
import '@/lib/api-config';

// Certificate List Response Type (backend dönüş yapısı)
interface CertificateListResponse {
  certificates: CertificateInfoDto[];
  success: boolean;
  keystoreType: string;
  certificateCount: number;
}

// List Certificates
export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const response = await CertificateInfoService.listCertificates();
      // Backend'den gelen response'u CertificateListResponse olarak cast et
      return response as unknown as CertificateListResponse;
    },
  });
};

// Keystore Info
export const useKeystoreInfo = () => {
  return useQuery({
    queryKey: ['keystore-info'],
    queryFn: () => CertificateInfoService.getKeystoreInfo(),
  });
};

// TÜBİTAK Credit
export const useTubitakCredit = () => {
  return useQuery({
    queryKey: ['tubitak-credit'],
    queryFn: () => TBTakService.getCreditInfo(),
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
