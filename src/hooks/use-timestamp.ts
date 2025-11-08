import { useMutation, useQuery } from '@tanstack/react-query';
import { TimestampService } from '@/api/generated';
import axios from 'axios';

// Configure API client
import '@/lib/api-config';

// Get Timestamp - Use Axios directly for binary response
export const useGetTimestamp = () => {
  return useMutation({
    mutationFn: async (data: { document: Blob; hashAlgorithm?: string }) => {
      const formData = new FormData();
      formData.append('document', data.document);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8085'}/api/timestamp/get`,
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
      
      // Backend JSON object veya string dönebilir
      if (typeof status === 'string') {
        try {
          const parsed = JSON.parse(status);
          return {
            available: parsed.configured === true,
            status: parsed.message || status,
          };
        } catch {
          return {
            available: status.includes('aktif') || status.includes('available') || status.includes('OK'),
            status,
          };
        }
      }
      
      // Eğer zaten object ise
      if (typeof status === 'object' && status !== null) {
        const statusObj = status as any;
        return {
          available: statusObj.configured === true,
          status: statusObj.message || JSON.stringify(status),
        };
      }
      
      return {
        available: false,
        status: String(status),
      };
    },
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
