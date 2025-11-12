import { useMutation, useQuery } from '@tanstack/react-query';
import { TimestampService } from '@/api/generated';
import axios from 'axios';

// Configure API client
import '@/lib/api-config';
import { SIGN_API_URL } from '@/lib/runtime-config';

// Get Timestamp - Use Axios directly for binary response
export const useGetTimestamp = () => {
  return useMutation({
    mutationFn: async (data: { document: Blob; hashAlgorithm?: string }) => {
      const formData = new FormData();
      formData.append('document', data.document);
      
      const response = await axios.post(
        `${SIGN_API_URL()}/api/timestamp/get`,
        formData,
        {
          params: {
            hashAlgorithm: data.hashAlgorithm || 'SHA256',
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer', // CRITICAL: Binary response
        }
      );
      
      return response.data; // Returns ArrayBuffer
    },
  });
};

// Validate Timestamp
export const useValidateTimestamp = () => {
  return useMutation({
    mutationFn: async (data: { timestampToken: Blob; originalDocument?: Blob }) => {
      const result = await TimestampService.validateTimestamp({
        timestampToken: data.timestampToken,
        originalDocument: data.originalDocument,
      });
      return result;
    },
  });
};

// Timestamp Status
export const useTimestampStatus = () => {
  return useQuery({
    queryKey: ['timestamp-status'],
    queryFn: async () => {
      const status = await TimestampService.getStatus();
      
      // Önce object olarak kontrol et (backend Map<String, Object> döndürüyor)
      if (typeof status === 'object' && status !== null) {
        const statusObj = status as any;
        return {
          available: statusObj.configured === true,
          status: statusObj.message || JSON.stringify(status),
        };
      }
      
      // Backend JSON string dönerse
      if (typeof status === 'string') {
        try {
          const parsed = JSON.parse(status);
          return {
            available: parsed.configured === true,
            status: parsed.message || status,
          };
        } catch {
          // Parse edilemezse string içeriğinden tahmin et
          return {
            available: status.includes('aktif') || status.includes('available') || status.includes('OK'),
            status,
          };
        }
      }
      
      // Beklenmeyen durum
      return {
        available: false,
        status: String(status),
      };
    },
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
