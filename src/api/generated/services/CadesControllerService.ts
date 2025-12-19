/* CAdES imzalama servisi */
import { OpenAPI } from '../core/OpenAPI';
import { CancelablePromise } from '../core/CancelablePromise';

export type TimestampType = 'none' | 'signature' | 'content' | 'archive' | 'esc' | 'all';

export interface SignCadesRequest {
    content: string;
    timestampType?: TimestampType;
    signatureId?: string;
}

export class CadesControllerService {
    /**
     * Metin içeriğini CAdES imzası ile imzalar
     * @param content İmzalanacak metin içeriği
     * @param timestampType Zaman damgası türü
     * @param signatureId İmza ID'si (opsiyonel)
     * @returns binary İmzalı CAdES dosyası (.p7s)
     * @throws ApiError
     */
    public static signCades(
        content: string,
        timestampType: TimestampType = 'signature',
        signatureId?: string,
    ): CancelablePromise<Blob> {
        return new CancelablePromise(async (resolve, reject, onCancel) => {
            try {
                const params = new URLSearchParams();
                params.append('timestampType', timestampType);
                if (signatureId) {
                    params.append('signatureId', signatureId);
                }

                const controller = new AbortController();
                onCancel(() => controller.abort());

                const response = await fetch(`${OpenAPI.BASE}/v1/cadessign?${params.toString()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: content,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    reject(new Error(errorText || `HTTP ${response.status}`));
                    return;
                }

                const blob = await response.blob();
                resolve(blob);
            } catch (error) {
                reject(error);
            }
        });
    }
}
