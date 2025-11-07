import { useMutation, useQuery } from '@tanstack/react-query';
import { TimestampService } from '@/api/generated';

// Configure API client
import '@/lib/api-config';

// Get Timestamp
export const useGetTimestamp = () => {
  return useMutation({
    mutationFn: async (data: { document: Blob; hashAlgorithm?: string }) => {
      const result = await TimestampService.getTimestamp(
        data.hashAlgorithm || 'SHA256',
        { document: data.document }
      );
      return result;
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
      // Parse status string to object
      return {
        available: status.includes('available') || status.includes('OK'),
        status,
      };
    },
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
